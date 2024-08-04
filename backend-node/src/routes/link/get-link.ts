import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';

export async function getLinks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:trip_id/links',
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
          links: true
        }
      });

      if (!trip) {
        return new ClientError('Trip not found');
      }

      return { links: trip.links };
    }
  );
}
