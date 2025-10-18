import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'

if (getApps().length === 0) {
  initializeApp()
}

const firestore = getFirestore()
const messaging = getMessaging()

export { firestore, messaging }
