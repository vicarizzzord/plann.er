import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';

export async function updateParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/participants/:participant_id',
    {
      schema: {
        params: z.object({
          participant_id: z.string().uuid()
        }),
        body: z.object({
          name: z.string()
        })
      }
    },
    async (request) => {
      const { participant_id } = request.params;
      const { name } = request.body;

      const participant = await prisma.participants.update({
        where: { id: participant_id },
        data: { name: name }
      });

      if (!participant) {
        return new ClientError('Participant not found');
      }

      return { participantId: participant.id };
    }
  );
}
