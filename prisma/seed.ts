import { prisma } from '../src/lib/prisma'

const seed = async () => {
	const alreadyExists = await prisma.event.findUnique({
		where: {
			id: 'cfb2f402-32a1-4388-acd2-9db8938d7110'
		}
	})
	if (!alreadyExists) {
		await prisma.event.create({
			data: {
				id: 'cfb2f402-32a1-4388-acd2-9db8938d7110',
				title: 'Unite Summit',
				slug: 'unite-summit',
				details: 'A conference for developers',
				maximumAttendees: 120
			}
		})
		await prisma.attendee.createMany({
			data: [
				{
					eventId: 'cfb2f402-32a1-4388-acd2-9db8938d7110',
					name: 'Alice',
					email: 'a@b.com',
					id: 1
				},
				{
					eventId: 'cfb2f402-32a1-4388-acd2-9db8938d7110',
					name: 'Benny',
					email: 'b@b.com',
					id: 2
				},
				{
					eventId: 'cfb2f402-32a1-4388-acd2-9db8938d7110',
					name: 'Charlie',
					email: 'c@b.com'
				},
				{
					eventId: 'cfb2f402-32a1-4388-acd2-9db8938d7110',
					name: 'David',
					email: 'd@b.com'
				}
			]
		})
	}
}

seed().then(() => {
	console.log('Database populated!')
	prisma.$disconnect()
})
