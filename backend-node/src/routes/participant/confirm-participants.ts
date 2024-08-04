import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';
import { env } from '../../env';

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

export async function confirmParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/participant/:participant_id/confirm',
    {
      schema: {
        params: z.object({
          participant_id: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { participant_id } = request.params;

      const participant = await prisma.participants.findUnique({
        where: {
          id: participant_id
        }
      });

      if (!participant) {
        throw new ClientError('Participant not found');
      }

      if (participant.is_confirmed) {
        return reply.redirect(
          `${env.WEB_BASE_URL}/trips/${participant.trip_id}`
        );
      }

      await prisma.participants.update({
        where: {
          id: participant_id
        },
        data: {
          is_confirmed: true
        }
      });

      return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);
    }
  );
}
