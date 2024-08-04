import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';
import dayjs from '../../lib/dayjs';

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/trips/:trip_id',
    {
      schema: {
        params: z.object({
          trip_id: z.string().uuid()
        }),
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date()
        })
      }
    },
    async (request) => {
      const { trip_id } = request.params;
      const { destination, ends_at, starts_at } = request.body;

      const trip = await prisma.trip.findUnique({
        where: {
          id: trip_id
        }
      });

      if (!trip) {
        return new ClientError('Trip not found');
      }

      const startDateIsNotValid = dayjs(starts_at).isBefore(new Date());
      const endDateIsNotValid = dayjs(ends_at).isBefore(starts_at);

      if (startDateIsNotValid) {
        throw new ClientError('Invalid trip start date');
      }
      if (endDateIsNotValid) {
        throw new ClientError('Invalid trip end date');
      }

      await prisma.trip.update({
        where: {
          id: trip_id
        },
        data: {
          destination: destination,
          starts_at: starts_at,
          ends_at: ends_at
        }
      });

      return { tripId: trip.id };
    }
  );
}
