import dayjs from 'dayjs'
import { prisma } from '../src/lib/prisma'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

const main = async () => {
	try {
		const events = await prisma.event.findUnique({
			where: {
				id: '1df0f5d8-066d-4c41-b016-f6ca9a241c6a'
			}
		})
		if (events) {
			console.log('Database already seeded. 🌱')
			return
		}
		await prisma.event.deleteMany()
		const title = faker.music.songName()
		const slug = faker.helpers.slugify(title)
		const details = faker.lorem.paragraph()
		const maximumAttendees = faker.number.int({ min: 100, max: 300 })
		const id = '1df0f5d8-066d-4c41-b016-f6ca9a241c6a'

		await prisma.event.create({
			data: {
				id,
				title,
				slug,
				details,
				maximumAttendees
			}
		})

		for (let index = 0; index < maximumAttendees; index++) {
			await prisma.attendee
				.create({
					data: {
						eventId: id,
						name: faker.person.fullName(),
						email: faker.internet.email(),
						id: faker.number.int({ min: 1, max: 1000 }),
						createdAt: faker.date.recent({
							days: 30,
							refDate: dayjs().subtract(8, 'days').toDate()
						}),
						checkIn: faker.helpers.arrayElement<
							Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined
						>([
							undefined,
							{
								create: {
									createdAt: faker.date.recent({ days: 7 })
								}
							}
						])
					}
				})
				.catch((err) => {
					console.log('could not create attendee.')
				})
		}
		console.log(`Database has been seeded. 🌱`)
	} catch (error) {
		throw error
	}
}

main().catch((err) => {
	console.warn('Error While generating Seed: \n', err)
})
