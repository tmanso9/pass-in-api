import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { createEvent } from './routes/createEvent'
import { registerForEvent } from './routes/registerForEvent'
import { getEvent } from './routes/getEvent'
import { getAttendeeBadge } from './routes/getAttendeeBadge'
import { checkIn } from './routes/checkIn'
import { getEventAttendees } from './routes/getEventAttendees'

const app = Fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getEventAttendees)
app.register(getAttendeeBadge)
app.register(checkIn)

app.listen({ port: 3000 }).then(() => {
	console.log('HTTP server running on port 3000!')
})
