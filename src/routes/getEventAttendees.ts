import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '../lib/prisma'

export const getEventAttendees = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/events/:eventId/attendees',
		{
			schema: {
				summary: 'Get event attendees',
				tags: ['events'],
				description: 'Get attendees of an event by its ID.',
				params: z.object({
					eventId: z.string().uuid()
				}),
				querystring: z.object({
					pageIndex: z.string().nullish().default('0').transform(Number),
					query: z.string().nullish()
				}),
				response: {
					200: z.object({
						attendees: z.array(
							z.object({
								id: z.number(),
								name: z.string(),
								email: z.string().email(),
								createdAt: z.date(),
								checkedInAt: z.date().nullable()
							})
						),
						total: z.number()
					})
				}
			}
		},
		async (request, reply) => {
			const { eventId } = request.params
			const { pageIndex, query } = request.query

			const attendees = await prisma.attendee.findMany({
				where: query
					? {
							eventId,
							OR: [{ name: { contains: query } }, { email: { contains: query } }]
					  }
					: { eventId },
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					checkIn: {
						select: {
							createdAt: true
						}
					}
				},
				take: 10,
				skip: pageIndex * 10,
				orderBy: {
					createdAt: 'desc'
				}
			})

			const total = await prisma.attendee.count({
				where: query
					? {
							eventId,
							OR: [{ name: { contains: query } }, { email: { contains: query } }]
					  }
					: { eventId }
			})

			reply.send({
				attendees: attendees.map((attendee) => {
					return {
						id: attendee.id,
						name: attendee.name,
						email: attendee.email,
						createdAt: attendee.createdAt,
						checkedInAt: attendee.checkIn?.createdAt ?? null
					}
				}),
				total
			})
		}
	)
}
