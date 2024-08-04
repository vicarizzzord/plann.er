import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { ClientError } from '../../errors/client-error';

export async function getParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:trip_id/participants',
    {
      schema: {
        params: z.object({
          trip_id: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { trip_id } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: trip_id
        },
        include: {
          participants: {
            select: {
              id: true,
              email: true,
              name: true,
              is_confirmed: true
            }
          }
        }
      });

      if (!trip) {
        return new ClientError('Trip not found');
      }

      return { participants: trip.participants };
    }
  );
}
