import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '../lib/prisma'
import { BadRequest } from './_errors/badRequest'

export const checkIn = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/attendees/:attendeeId/check-in',
		{
			schema: {
				summary: 'Check in an attendee',
				tags: ['check-ins'],
				description: 'Check in an attendee by their ID.',
				params: z.object({
					attendeeId: z.coerce.number().int()
				}),
				response: {
					201: z.null()
				}
			}
		},
		async (request, reply) => {
			const { attendeeId } = request.params

			const attendeeCheckIn = await prisma.checkIn.findUnique({
				where: {
					attendeeId
				}
			})

			if (attendeeCheckIn){
				throw new BadRequest('Attendee already checked in.')
			}

			await prisma.checkIn.create({
				data: {
					attendeeId
				}
			})

			reply.status(201).send()
		}
	)
}
