import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { Timestamp } from 'firebase-admin/firestore'
import { getApps, initializeApp } from 'firebase-admin/app'
import { Themes, User } from '../../types/models/todo-model'
import { USER_AVATAR } from '../../types/constants/constants'
import { logger } from 'firebase-functions'

if (getApps().length === 0) {
  initializeApp()
}

export const onCreateUser = onDocumentCreated(
  {
    region: 'europe-central2',
    document: 'users/{userId}',
  },
  async (event) => {
    const userId = event.params.userId
    const userRef = event.data?.ref
    const incomingData: Partial<User> = event.data?.data() || {}

    try {
      const defaultValues: User = {
        uid: userId,
        email: incomingData.email ?? '',
        photo_url: incomingData.photo_url ?? USER_AVATAR,
        display_name: incomingData.display_name ?? 'Anonymous',
        phone_number: incomingData.phone_number ?? '',
        created_time: Timestamp.now(),
        last_active_time: Timestamp.now(),
        theme: Themes.LIGHT,
        total_tasks: 0,
        completed_tasks: 0,
        daily_reminder_time: '09:00',
        is_enabled_notifications: true,
      }

      const updates: Partial<User> = {}

      for (const [key, defaultValue] of Object.entries(defaultValues)) {
        const userKey = key as keyof User

        if (incomingData[userKey] == null) {
          updates[userKey] = defaultValue
        }
      }

      if (userRef && Object.keys(updates).length > 0) {
        await userRef.update(updates)
        logger.log('✅ Дополнены поля для пользователя:', userId, updates)
      } else {
        logger.log('✅ Все поля уже заполнены для:', userId)
      }
    } catch (error) {
      logger.error('❌ Ошибка при инициализации пользователя:', error)
      throw error
    }
  },
)
