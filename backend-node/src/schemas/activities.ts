import z from 'zod';
import { participantSchema } from './participants';
import { tripSchema } from './trip';

export const activitySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  occurs_at: z.coerce.date(),
  trip_ip: z.string().uuid()
});

export const createActivitySchema = z.object({
  title: z.string(),
  occurs_at: z.coerce.date()
});

export const createActivityResponseSchema = z.object({
  tripId: z.string().uuid()
});

// export type CreateTripRequestType = z.infer<typeof createTripSchema>;
// export type CreateTripResponseType = z.infer<typeof createTripResponseSchema>;
// export type ActivityType = z.infer<typeof activitySchema>;
