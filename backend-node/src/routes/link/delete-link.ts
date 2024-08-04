import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';

export async function deleteLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/trips/:trip_id/links/:link_id',
    {
      schema: {
        params: z.object({
          trip_id: z.string().uuid(),
          link_id: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { trip_id, link_id } = request.params;

      const [trip, activity] = await prisma.$transaction([
        prisma.trip.findUnique({
          where: {
            id: trip_id
          },
          include: {
            links: true
          }
        }),
        prisma.link.findUnique({
          where: {
            id: link_id
          }
        })
      ]);

      if (!trip) {
        return new ClientError('Trip not found');
      }

      if (!activity) {
        return new ClientError('Activity not found');
      }

      await prisma.link.delete({
        where: {
          id: link_id
        }
      });

      return { message: 'Link deleted' };
    }
  );
}
