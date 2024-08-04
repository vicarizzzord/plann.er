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
import { confirmTrip } from './routes/trip/confirm-trip';
import { createTrip } from './routes/trip/create-trip';
import { getTripDetails } from './routes/trip/get-trip-details';
import { updateTrip } from './routes/trip/update-trip';
import { deleteParticipant } from './routes/participant/delete-participants';
import { deleteActivitiy } from './routes/activity/delete-activity';
import { deleteLink } from './routes/link/delete-link';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(createTrip);
app.register(confirmTrip);
app.register(updateTrip);
app.register(getTripDetails);
app.register(createInvite);
app.register(confirmParticipants);
app.register(getParticipant);
app.register(getParticipants);
app.register(deleteParticipant);
app.register(createActivity);
app.register(getActivities);
app.register(deleteActivitiy);
app.register(createLink);
app.register(getLinks);
app.register(deleteLink)
app.register(updateParticipant);

app.register(cors, {
  origin: 'http://localhost:5173'
});

app.listen({ port: env.PORT }).then(() => {
  console.log('Server running on port 3333.');
});
