import { client, db } from '@/db'
import { goalCompletions, goals, users } from './schema'
import { fakerPT_BR as faker } from '@faker-js/faker'

import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)
  await db.delete(users)

  const [user] = await db
    .insert(users)
    .values({
      name: 'john doe',
      externalAccountId: 4545465,
      avatarUrl: 'https://github.com/mateusramoscaetano.png',
    })
    .returning()

  const [goal1, goal2] = await db
    .insert(goals)
    .values([
      { userId: user.id, title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { userId: user.id, title: 'Me exercitar', desiredWeeklyFrequency: 3 },
      { userId: user.id, title: 'Meditar', desiredWeeklyFrequency: 1 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: goal1.id, createdAt: startOfWeek.toDate() },
    { goalId: goal2.id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().then(() => {
  console.log('🌱 Database seeded successfully!')
  client.end()
})
