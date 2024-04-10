import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export const health = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/health',
		{
			schema: {
				response: {
					200: z.object({
						message: z.string()
					})
				},
				tags: ['usage'],
				summary: 'Health check',
				description: 'Check if the API is up and running.'
			}
		},
		async (request, reply) => {
			return reply.status(200).send({ message: 'ok' })
		}
	)
}
