import z from 'zod';
import { tripSchema } from './trip';

export const linkSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  url: z.string().url(),
  trip_ip: z.string().uuid()
});

export type LinkType = z.infer<typeof linkSchema>;

export const createLinkBodySchema = z.object({
  title: z.string(),
  url: z.string().url()
});

export type CreateLinkSchemaRequestBodyType = z.infer<
  typeof createLinkBodySchema
>;

export const createLinkParamsSchema = z.object({
  trip_id: z.string().uuid()
});

export type CreateLinkSchemaRequestParamsType = z.infer<
  typeof createLinkParamsSchema
>;

export const createLinkResponseSchema = z.object({
  link_id: z.string().uuid()
});

export type CreateLinkResponseSchemaType = z.infer<
  typeof createLinkResponseSchema
>;
