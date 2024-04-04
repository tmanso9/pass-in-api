import Fastify from 'fastify'

const app = Fastify()

app.listen({ port: 3000 }).then(() => {
	console.log('HTTP server running on port 3000!')
})

// 

app.get('/', async () => {
	return "Hello NLW Unite"
})
