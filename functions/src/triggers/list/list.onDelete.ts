import { onCall } from 'firebase-functions/v2/https'
import { logger } from 'firebase-functions'


export const onDeleteList = onCall(
  {
    region: 'europe-central2',
  },
  async (request) => {
    const { listId } = request.data ?? 'хуй!!'
    // твоя логика удаления по id
    logger.debug('Вызвана deleteList для:', listId)
    // Можно реализовать каскадное удаление тут по логике
    // ...
    // Возврат ответа
    return { success: true }
  },
)
