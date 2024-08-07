import z from 'zod';
import { participantSchema } from './participants';
import { activitySchema } from './activities';
import { linkSchema } from './links';

export const tripSchema = z.object({
  id: z.string().uuid(),
  destination: z.string(),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  created_at: z.coerce.date(),
  is_confirmed: z.boolean(),
  participants: z.array(participantSchema),
  activities: z.array(activitySchema),
  links: z.array(linkSchema)
});

export type TripType = z.infer<typeof tripSchema>;

export const createTripSchema = z.object({
  destination: z.string().min(4),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  owner_name: z.string(),
  owner_email: z.string().email(),
  emails_to_invite: z.array(z.string().email())
});

export type CreateTripRequestType = z.infer<typeof createTripSchema>;

export const createTripResponseSchema = z.object({
  tripId: z.string().uuid()
});

export type CreateTripResponseType = z.infer<typeof createTripResponseSchema>;

export const getTripDetailsParamsSchema = z.object({
  trip_id: z.string()
});

export type GetTripRequestType = z.infer<typeof getTripDetailsParamsSchema>;
