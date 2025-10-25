import { User } from 'src/types/models/todo-model'
import { logger } from 'firebase-functions'
import { firestore, messaging } from './firebaseAdmin'

/**
 * Отправляет push-уведомление пользователю по его UID.
 * @param {string} uid - Идентификатор пользователя в Firebase Auth.
 * @param {string} title - Заголовок уведомления.
 * @param {string} body - Текст уведомления.
 * @returns {Promise<void>}
 */
export async function sendPushToUser(uid: string, title: string, body: string): Promise<void> {
  const userRef = firestore.collection('users').doc(uid)
  const userSnap = await userRef.get()

  if (!userSnap.exists) return

  const userData = userSnap.data() as User
  if (!userData.is_enabled_notifications) return

  const tokensSnap = await userRef.collection('fcm_tokens').get()
  const tokens = tokensSnap.docs
    .map((doc) => doc.data().fcm_token)
    .filter(Boolean)

  if (!tokens.length) return

  try {
    const response = await messaging.sendEachForMulticast({
      notification: { title, body },
      tokens,
    })

    // Очистка невалидных токенов
    if (response.failureCount > 0) {
      const batch = firestore.batch()
      tokensSnap.docs
        .filter((_, i) => !response.responses[i].success)
        .forEach((doc) => batch.delete(doc.ref))
      await batch.commit()
    }

    logger.log(`✅ Push sent to ${response.successCount} device(s) for user ${uid}`)
  } catch (error) {
    logger.error('❌ FCM send error:', error)
  }
}
