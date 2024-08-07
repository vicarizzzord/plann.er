import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { date, z } from 'zod';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import nodemailer from 'nodemailer';
import { prisma } from '../../lib/prisma';
import { ClientError } from '../../errors/client-error';
import { env } from '../../env';
import { getMailClient } from '../../lib/mailer';

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:trip_id/confirm',
    {
      schema: {
        params: z.object({
          trip_id: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { trip_id } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: trip_id
        },
        include: {
          participants: {
            where: {
              is_owner: false
            }
          }
        }
      });

      if (!trip) {
        throw new ClientError('Trip not found');
      }

      if (trip.is_confirmed) {
        return reply.redirect(`${env.WEB_BASE_URL}/trips/${trip_id}`);
      }

      await prisma.trip.update({
        where: {
          id: trip_id
        },
        data: {
          is_confirmed: true
        }
      });

      const formattedStartDate = dayjs(trip.starts_at).format('LL');
      const formattedEndDate = dayjs(trip.ends_at).format('LL');

      const mail = await getMailClient();

      await Promise.all(
        trip.participants.map(async (participant) => {
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

      return reply.redirect(`${env.WEB_BASE_URL}/trips/${trip_id}`);
    }
  );
}
