import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { ClientError } from '../../errors/client-error';
import { getMailClient } from '../../lib/mailer';
import { prisma } from '../../lib/prisma';
import dayjs from '../../lib/dayjs';
import { env } from '../../env';

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:trip_id/invite',
    {
      schema: {
        params: z.object({
          trip_id: z.string().uuid()
        }),
        body: z.object({
          emailsToInvite: z.array(z.string().email())
        })
      }
    },
    async (request) => {
      const { emailsToInvite } = request.body;
      const { trip_id } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: trip_id
        },
        include: {
          participants: true
        }
      });

      if (!trip) {
        return new ClientError('Trip not found');
      }

      const newParticipants = await prisma.participants.createMany({
        data: emailsToInvite.map((email) => {
          return { email, trip_id };
        })
      });

      const newlyCreatedParticipants = await prisma.participants.findMany({
        where: {
          email: { in: emailsToInvite },
          trip_id
        }
      });

      const formattedStartDate = dayjs(trip.starts_at).format('LL');
      const formattedEndDate = dayjs(trip.ends_at).format('LL');

      const mail = await getMailClient();

      await Promise.all(
        newlyCreatedParticipants.map(async (participant) => {
          const confirmationLink = `${env.WEB_BASE_URL}/trips/${trip_id}/participant/${participant.id}/invite`;
          const message = await mail.sendMail({
            from: {
              name: 'Equipe Plann.er',
              address: 'equipe@email.com'
            },
            to: participant.email,
            subject: `Confirme sua viagem para ${trip.destination}`,
            html: `
                        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">
                        <p>
                            Você foi convidado(a) para participar de uma viagem para
                            <strong>${trip.destination} </strong>
                            nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}.</strong>
                        </p>
                        <p></p>
                        <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                        <p></p>
                        <a href="${confirmationLink}">Confirmar viagem</a>
        
                        <p>
                        Caso esteja usando o dispositivo móvel, você também pode confirmar a criação
                        da viagem pelos aplicativos:
                        </p>
                        <p></p>
                        <p>
                        Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.
                    </p>
                    </div>
        
                    `.trim()
          });

          console.log(nodemailer.getTestMessageUrl(message));
        })
      );
    }
  );
}
