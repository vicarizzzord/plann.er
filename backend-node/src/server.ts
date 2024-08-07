import fastify from 'fastify';
import cors from '@fastify/cors';
import {
  validatorCompiler,
  serializerCompiler
} from 'fastify-type-provider-zod';
import { errorHandler } from './error-handler';
import { env } from './env';
import { createActivity } from './routes/activity/create-activity';
import { getActivities } from './routes/activity/get-activities';
import { createLink } from './routes/link/create-link';
import { getLinks } from './routes/link/get-link';
import { confirmParticipants } from './routes/participant/confirm-participants';
import { createInvite } from './routes/participant/create-invite';
import { getParticipant } from './routes/participant/get-participant';
import { getParticipants } from './routes/participant/get-participants';
import { updateParticipant } from './routes/participant/update-participant';
import { createTrip } from './routes/trip/create-trip';
import { getTripDetails } from './routes/trip/get-trip-details';
import { deleteParticipant } from './routes/participant/delete-participants';
import { deleteActivitiy } from './routes/activity/delete-activity';
import { deleteLink } from './routes/link/delete-link';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const app = fastify({ logger: true });

app.register(cors, {
  origin: 'http://localhost:5173'
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(swagger, {
  openapi: {
    openapi: '3.0.3',
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Development server'
      }
    ],
    tags: [
      { name: 'trips', description: 'trips related end-points' },
      { name: 'participants', description: 'participants related end-points' },
      { name: 'links', description: 'links related end-points' }
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        }
      }
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    }
  }
});

app.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true
});

app.register(createTrip);
app.register(getTripDetails);
app.register(createLink);
// app.register(confirmTrip);
// app.register(updateTrip);
// app.register(createInvite);
// app.register(confirmParticipants);
// app.register(getParticipant);
// app.register(getParticipants);
// app.register(deleteParticipant);
// app.register(createActivity);
// app.register(getActivities);
// app.register(deleteActivitiy);
// app.register(getLinks);
// app.register(deleteLink);
// app.register(updateParticipant);

app.ready();

app.listen({ port: env.PORT }).then(() => {
  console.log('Server running on port 3333.');
});
