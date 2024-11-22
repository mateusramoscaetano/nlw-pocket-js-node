import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal'
import { createGoalCompletionRoute } from './routes/create-goal-completion'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import { getWeekPendingGoalsRoute } from './routes/get-week-pending-goals'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { authenticateFromGithubRoute } from './routes/authenticate-from-github'
import { env } from '@/env'
import fastifyJwt from '@fastify/jwt'
import { getProfile } from './routes/get-profile'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { getUserExperienceAndLevelRoute } from './routes/get-user-level-and-experience'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'in-orbit',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(getWeekSummaryRoute)
app.register(getWeekPendingGoalsRoute)
app.register(authenticateFromGithubRoute)
app.register(getProfile)
app.register(getUserExperienceAndLevelRoute)

const port = Number(env.PORT) || 3333

app
  .listen({
    port,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`HTTP server running on port ${port}`)
  })
  .catch(err => {
    console.error('Error starting server:', err)
    process.exit(1)
  })

if (env.NODE_ENV === 'development') {
  const specFile = resolve(__dirname, '../../swagger.json')

  app.ready().then(() => {
    const spec = JSON.stringify(app.swagger(), null, 2)

    writeFile(specFile, spec).then(() => console.log('swagger spec generated'))
  })
}
