import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticateUserHook } from '../hooks/authenticate-user'
import { getUserLevelAndExperience } from '@/app/functions/get-user-level-and-experience'

export const getUserExperienceAndLevelRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/profile/gamification',
      {
        onRequest: [authenticateUserHook],
        schema: {
          tags: ['users', 'gamification'],
          description: 'Get user experience and level',
          operationId: 'getUserExperienceAndLevel',
          response: {
            200: z.object({
              experience: z.number(),
              level: z.number(),
              experienceToNextLevel: z.number(),
              experienceForCurrentLevel: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = request.user.sub
        const {
          experience,
          level,
          experienceToNextLevel,
          experienceForCurrentLevel,
        } = await getUserLevelAndExperience({ userId })
        return reply.status(200).send({
          experience,
          level,
          experienceToNextLevel,
          experienceForCurrentLevel,
        })
      }
    )
  }
