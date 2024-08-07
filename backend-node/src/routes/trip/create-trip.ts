import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import dayjs from '../../lib/dayjs';
import { ClientError } from '../../errors/client-error';
import { getMailClient } from '../../lib/mailer';
import { prisma } from '../../lib/prisma';
import { env } from '../../env';
import {
  CreateTripRequestType,
  createTripResponseSchema,
  createTripSchema
} from '../../schemas/trip';
import { createTripRequestSchema } from '../../schemas/examples.ts/trip';

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post<{ Body: CreateTripRequestType }>(
    '/trips',
    {
      schema: {
        description:
          'Creates a new trip and sends confirmation emails to the participants.',
        tags: ['trips'],
        body: {
          type: 'object',
          properties: createTripSchema.shape,
          required: [
            'destination',
            'starts_at',
            'ends_at',
            'owner_name',
            'owner_email'
          ],
          example: createTripRequestSchema
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: createTripResponseSchema.shape,
            example: {
              tripId: '123e4567-e89b-12d3-a456-426614174000'
            }
          }
        }
      }
    },
    async (request) => {
      const {
        destination,
        ends_at,
        starts_at,
        owner_email,
        owner_name,
        emails_to_invite
      } = request.body;

      const startDateIsNotValid = dayjs(starts_at).isBefore(new Date());
      const endDateIsNotValid = dayjs(ends_at).isBefore(starts_at);

      if (startDateIsNotValid) {
        throw new ClientError('Invalid trip start date');
      }
      if (endDateIsNotValid) {
        throw new ClientError('Invalid trip end date');
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true
                },
                ...emails_to_invite.map((email) => {
                  return { email };
                })
              ]
            }
          }
        }
      });

      const formattedStartDate = dayjs(starts_at).format('LL');
      const formattedEndDate = dayjs(ends_at).format('LL');

      const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: 'Equipe Plann.er',
          address: 'equipe@email.com'
        },
        to: {
          name: owner_name,
          address: owner_email
        },
        subject: `Confirme sua viagem para ${destination}`,
        html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">
                <p>
                    Você solicitou a criação de uma viagem para
                    <strong>${destination} </strong>
                    nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}.</strong>
                </p>
                <p></p>
                <p>Para confirmar sua viagem, clique no link abaixo:</p>
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

      return { tripId: trip.id };
    }
  );
}
