import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';

export async function getTripDetails(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:trip_id',
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
        select: {
          id: true,
          destination: true,
          starts_at: true,
          ends_at: true
        },
        where: {
          id: trip_id
        }
      });

      if (!trip) {
        return new ClientError('Trip not found');
      }

      return { trip: trip };
    }
  );
}
