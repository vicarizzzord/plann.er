import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/participants/:participant_id',
    {
      schema: {
        params: z.object({
          participant_id: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { participant_id } = request.params;

      const participant = await prisma.participants.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          is_confirmed: true,
          trip_id: true
        },
        where: {
          id: participant_id
        }
      });

      if (!participant) {
        return new ClientError('Participant not found');
      }

      return { participant: participant };
    }
  );
}
