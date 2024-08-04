import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { ClientError } from '../../errors/client-error';
import dayjs from '../../lib/dayjs';

export async function deleteActivitiy(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/trips/:trip_id/activities/:activity_id',
    {
      schema: {
        params: z.object({
          trip_id: z.string().uuid(),
          activity_id: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { trip_id, activity_id } = request.params;

      const [trip, activity] = await prisma.$transaction([
        prisma.trip.findUnique({
          where: {
            id: trip_id
          }
        }),
        prisma.activity.findUnique({
          where: {
            id: activity_id
          }
        })
      ]);

      if (!trip) {
        return new ClientError('Trip not found');
      }

      if (!activity) {
        return new ClientError('Activity not found');
      }

      await prisma.activity.delete({
        where: {
          id: activity_id
        }
      });

      return { message: 'Activity deleted' };
    }
  );
}
