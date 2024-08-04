import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { ClientError } from '../../errors/client-error';

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:trip_id/link/create',
    {
      schema: {
        params: z.object({
          trip_id: z.string().uuid()
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url()
        })
      }
    },
    async (request) => {
      const { title, url } = request.body;
      const { trip_id } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: trip_id
        }
      });

      if (!trip) {
        return new ClientError('Trip not found');
      }

      const link = await prisma.link.create({
        data: {
          title: title,
          url: url,
          trip_id: trip_id
        }
      });

      return { link_id: link.id };
    }
  );
}
