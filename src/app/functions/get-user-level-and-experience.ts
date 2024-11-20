import { db } from '@/db'
import { users } from '@/db/schema'
import {
  calculateExperienceToLevel,
  calculateLevelFromExperience,
  calculateTotalExperienceForLevel,
} from '@/modules/gamification'
import { eq } from 'drizzle-orm'

interface GetUserLevelAndExperienceRequest {
  userId: string
}
export async function getUserLevelAndExperience({
  userId,
}: GetUserLevelAndExperienceRequest) {
  const [{ experience }] = await db
    .select({ experience: users.experience })
    .from(users)
    .where(eq(users.id, userId))
  const level = calculateLevelFromExperience(experience)
  const experienceToNextLevel = calculateTotalExperienceForLevel(level)
  return {
    experience,
    level,
    experienceToNextLevel,
  }
}
