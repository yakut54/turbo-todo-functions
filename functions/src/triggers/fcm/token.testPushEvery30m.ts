import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions'
import { sendPushToUser } from 'src/lib'
import { User } from 'src/types/models/todo-model'
import { firestore } from 'src/lib/firebaseAdmin'

/**
 * Отправляет тестовое push-уведомление каждые 30 минут (для отладки).
 */
export const testPushEvery30m = onSchedule(
  {
    schedule: '30 16 * * *',
    timeZone: 'Etc/UTC',
    region: 'europe-central2',
    timeoutSeconds: 60,
    memory: '256MiB',
  },
  async () => {
    const usersSnapshot = await firestore.collection('users').get()

    const pushPromises = usersSnapshot.docs
      .filter((doc) => doc.data().is_enabled_notifications === true)
      .map(async (doc) => {
        const userData: Partial<User> = doc.data()
        const userName = userData.display_name || 'Anonymous'

        // Логируем для каждого пользователя
        logger.log(`🔔 Тестовый пуш для ${userName} (${doc.id}) — \n14:30 NSK 154`)

        return sendPushToUser(
          doc.id,
          '1234567890 1234567890 1234567890 1234567890 ---',
          'бабах!!',
        )
      })

    const results = await Promise.allSettled(pushPromises)
    const successfulCount = results.filter((result) => result.status === 'fulfilled').length

    logger.log(`✅ Отправлено ${successfulCount} уведомлений для ${pushPromises.length} пользователей!`)
  },
)
