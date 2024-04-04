import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { generateSlug } from '../utils/generateSlug'
import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'

export const createEvent = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/events',
		{
			schema: {
				body: z.object({
					title: z.string().min(4),
					details: z.string().nullable(),
					maximumAttendees: z.number().int().positive().nullable()
				}),
				response: {
					201: z.object({ eventId: z.string().uuid() })
				}
			}
		},
		async (request, reply) => {
			const { title, details, maximumAttendees } = request.body
			const slug = generateSlug(title)

			const eventWithSameSlug = await prisma.event.findUnique({
				where: { slug }
			})

			if (eventWithSameSlug) {
				throw new Error('Event with same title already exists')
			}

			const event = await prisma.event.create({
				data: {
					title,
					details,
					maximumAttendees,
					slug
				}
			})

			// 201 Created
			return reply.status(201).send({ eventId: event.id })
		}
	)
}
