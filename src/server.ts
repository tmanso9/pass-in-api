import Fastify from 'fastify'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const app = Fastify()
const prisma = new PrismaClient({
	log: ['query']
})

app.get('/', async () => {
	return 'Hello NLW Unite'
})

app.post('/events', async (request, reply) => {
	const createEventSchema = z.object({
		title: z.string().min(4),
		details: z.string().nullable(),
		maximumAttendees: z.number().int().positive().nullable()
	})

	const data = createEventSchema.parse(request.body)
	const event = await prisma.event.create({
		data: {
			title: data.title,
			details: data.details,
			maximumAttendees: data.maximumAttendees,
			slug: new Date().toISOString()
		}
	})

	// 201 Created
	return reply.status(201).send({ eventId: event.id })
})

app.listen({ port: 3000 }).then(() => {
	console.log('HTTP server running on port 3000!')
})
