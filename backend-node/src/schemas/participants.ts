import z from 'zod';
import { tripSchema } from './trip';

export const participantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  is_confirmed: z.boolean(),
  is_owner: z.boolean(),
  email: z.string(),
  trip_id: z.string().uuid(),
});

export const createParticipantSchema = z.object({
  emails_to_invite: z.array(z.string().email())
});

export type ParticipantType = z.infer<typeof participantSchema>;
