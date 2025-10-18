import { onCall } from 'firebase-functions/v2/https'
import { getApps, initializeApp } from 'firebase-admin/app'
import { logger } from 'firebase-functions'

if (getApps().length === 0) {
  initializeApp()
}

export const onDeleteList = onCall(
  {
    region: 'europe-central2',
  },
  async (request) => {
    const { listId } = request.data ?? 'хуй!!'
    // твоя логика удаления по id
    logger.log('Вызвана deleteList для:', listId)
    // Можно реализовать каскадное удаление тут по логике
    // ...
    // Возврат ответа
    return { success: true }
  },
)
