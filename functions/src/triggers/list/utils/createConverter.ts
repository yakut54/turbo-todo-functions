import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from 'firebase-admin/firestore'

/**
 * Создаёт универсальный конвертер для Firestore.
 *
 * @template T - Тип данных модели
 * @returns {FirestoreDataConverter<T>} Конвертер для типа T
 */
export function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore: (data: WithFieldValue<T>): DocumentData => data as DocumentData,

    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): T => {
      return snapshot.data() as T
    },
  }
}
