import { ZodObject } from 'zod';

export type Trip = {
  id: string;
  destination: string;
  starts_at: Date;
  ends_at: Date;
  created_at: Date;
  is_confirmed: boolean;
  participants: Participant[];
  activities: Activity[];
  links: Link[];
};
