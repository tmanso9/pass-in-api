import Fastify from 'fastify'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { generateSlug } from './utils/generateSlug'

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

	const { title, details, maximumAttendees } = createEventSchema.parse(request.body)
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
})

app.listen({ port: 3000 }).then(() => {
	console.log('HTTP server running on port 3000!')
})
