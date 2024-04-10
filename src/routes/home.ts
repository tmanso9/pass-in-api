import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const homeRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get('/', async (request, reply) => {
		reply.status(200)
		return reply.html`
		<h3>Welcome to pass.in API</h3>
		<p><a href="/docs">Click here</a> for Swagger documentation.</p>
		`
	})
}
