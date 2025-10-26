import { logger } from 'firebase-functions'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { List } from 'src/types/models/todo-model'
import { DocumentReference, Timestamp } from 'firebase-admin/firestore'
import { createConverter } from 'src/triggers/list/utils/createConverter'
import { firestore } from 'src/lib/firebaseAdmin'


export const onCreateList = onDocumentCreated(
  {
    region: 'europe-central2',
    document: 'lists/{listId}',
  },
  async (event) => {
    const listId: string = event.params.listId
    const listRef = event.data?.ref as DocumentReference<List> | undefined
    const incomingData: Partial<List> = event.data?.data() || {}
    const ownerId = incomingData.owner_id

    if (!listRef) {
      logger.warn('No list reference', { listId })
      return
    }

    if (!ownerId) {
      logger.warn('Owner ID is missing')
      return
    }

    try {
      await firestore.runTransaction(async (transaction) => {
        const maxOrderSnapshot = await transaction.get(
          firestore.collection('lists')
            .withConverter(createConverter<List>())
            .where('owner_id', '==', ownerId)
            .orderBy('order', 'desc')
            .limit(1),
        )

        const maxOrder = maxOrderSnapshot.empty ? 0 : (maxOrderSnapshot.docs[0].data().order || 0)
        const order = maxOrder + 1

        const newListItem: Partial<List> = {
          order,
          owner_id: ownerId,
          updated_time: Timestamp.now(),
          created_time: Timestamp.now(),
          title: incomingData.title ?? 'WTF???',
          color: incomingData.color ?? '#f044dd',
          icon: incomingData.icon ?? 'person',
          is_archived: false,
          task_count: 0,
        }

        transaction.update(listRef, newListItem)

        logger.debug('✅ Обновлены поля для list item в транзакции:', listId, newListItem)
      })
    } catch (error) {
      logger.error('❌ Ошибка при формировании list item в транзакции:', error)
      throw error
    }
  },
)
