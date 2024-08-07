import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { ClientError } from '../../errors/client-error';
import {
  createLinkBodySchema,
  createLinkParamsSchema,
  createLinkResponseSchema,
  CreateLinkSchemaRequestBodyType,
  CreateLinkSchemaRequestParamsType
} from '../../schemas/links';
import { createLinkBodyExample } from '../../schemas/examples.ts/links';

export async function createLink(app: FastifyInstance, done: () => void) {
  app.withTypeProvider<ZodTypeProvider>().post<{
    Body: CreateLinkSchemaRequestBodyType;
    Params: CreateLinkSchemaRequestParamsType;
  }>(
    '/trips/:trip_id/link/create',
    {
      schema: {
        description: 'Create a new important link on trip',
        tags: ['links'],
        params: {
          type: 'object',
          properties: createLinkParamsSchema.shape
        },
        body: {
          type: 'object',
          properties: createLinkBodySchema.shape,
          example: createLinkBodyExample
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: createLinkResponseSchema.shape
          }
        }
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
      done()
      return { link_id: link.id };
    }
  );
}
