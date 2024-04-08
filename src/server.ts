import Fastify from 'fastify'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import {
	serializerCompiler,
	validatorCompiler,
	jsonSchemaTransform
} from 'fastify-type-provider-zod'
import { createEvent } from './routes/createEvent'
import { registerForEvent } from './routes/registerForEvent'
import { getEvent } from './routes/getEvent'
import { getAttendeeBadge } from './routes/getAttendeeBadge'
import { checkIn } from './routes/checkIn'
import { getEventAttendees } from './routes/getEventAttendees'
import { errorHandler } from './errorHandler'
import fastifyCors from '@fastify/cors'
import { health } from './routes/health'

const app = Fastify()

app.register(fastifyCors, {
	origin: '*'
})

app.register(fastifySwagger, {
	swagger: {
		consumes: ['application/json'],
		produces: ['application/json'],
		info: {
			title: 'pass.in',
			description:
				"API specifications for pass.in, an app built for the Node.js course of Rocketseat's NLW Unite.\nPass.in is an event management system which allows event creation, attendee registration and check-in.",
			version: '1.0.0'
		}
	},
	transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
	routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getEventAttendees)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(health)

app.setErrorHandler(errorHandler)

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
app.listen({ port, host: '0.0.0.0' }).then(() => {
	console.log(`HTTP server running! http://localhost:${port}/docs`)
})
