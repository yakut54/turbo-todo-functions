import { logger } from 'firebase-functions'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { List } from 'src/types/models/todo-model'
import type { DocumentReference } from 'firebase-admin/firestore'
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

    if (!listRef) {
      logger.warn('No list reference', { listId })
      return
    }

    const snapshot = await firestore
      .collection('lists')
      .withConverter(createConverter<List>())
      .get()

    const allLists = snapshot.docs.map((doc) => doc.data())
    logger.debug('All lists', { allLists })
  },
)

