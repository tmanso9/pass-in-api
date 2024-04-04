import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { createEvent } from './routes/createEvent'
import { registerForEvent } from './routes/registerForEvent'

const app = Fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)

app.listen({ port: 3000 }).then(() => {
	console.log('HTTP server running on port 3000!')
})
