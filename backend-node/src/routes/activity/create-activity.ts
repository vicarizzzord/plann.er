import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:trip_id/activities/create',
    {
      schema: {
        params: z.object({
          trip_id: z.string().uuid()
        }),
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date()
        })
      }
    },
    async (request) => {
      const { occurs_at, title } = request.body;
      const { trip_id } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: trip_id
        }
      });

      if (!trip) {
        return new ClientError('Trip not found');
      }

      if (dayjs(occurs_at).isBefore(trip.starts_at)) {
        throw new ClientError('Invalid activity start date');
      }
      if (dayjs(occurs_at).isAfter(trip.ends_at)) {
        throw new ClientError('Invalid activity end date');
      }

      const activity = await prisma.activity.create({
        data: {
          title,
          occurs_at,
          trip_id: trip_id
        }
      });

      return { activity_id: activity.id };
    }
  );
}
