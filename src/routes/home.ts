import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export const homeRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			schema: {
				response: {
					200: z.string({ description: 'Welcome page HTML code' })
				},
				tags: ['usage'],
				summary: 'API Home page',
				description: 'Welcome message for the API.',
				produces: ['text/html']
			}
		},
		async (request, reply) => {
			reply.status(200)
			return reply.html`
		<h3>Welcome to pass.in API</h3>
		<p><a href="/docs">Click here</a> for Swagger documentation.</p>
		`
		}
	)
}
