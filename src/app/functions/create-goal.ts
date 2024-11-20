import { db } from '@/db'
import { goals } from '@/db/schema'

interface CreateGoalRequest {
  userId: string
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoal({
  userId,
  title,
  desiredWeeklyFrequency,
}: CreateGoalRequest) {
  const [goal] = await db
    .insert(goals)
    .values({
      userId,
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  return { goal }
}
