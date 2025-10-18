import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

console.log('🔧 Инициализация Firebase Admin SDK...')
initializeApp({
  projectId: 'turbo-todo-54', // ← замени на свой projectId
})

const PORT = 9097
const db = getFirestore()
// 🔥 КЛЮЧЕВОЙ МОМЕНТ: явно указываем эмулятор
db.settings({ host: `localhost:${PORT}`, ssl: false })
console.log(`📡 Подключено к эмулятору Firestore: localhost:${PORT}`)

// eslint-disable-next-line require-jsdoc
async function seed() {
  const uid = 'test_user_123'

  console.log(`👤 Создаём пользователя: ${uid}`)
  await db.collection('users').doc(uid).set({
    uid: uid,
    created_time: new Date(),
    display_name: 'Test User',
    email: 'test@example.com',
    photo_url: '',
    phone_number: '',
    last_active: new Date(),
    themes: 'light',
    is_enabled_notifications: true,
    daily_reminder_time: '09:00',
    total_tasks: 0,
    completed_tasks: 0,
  })
  const users = await db.collection('users').listDocuments()
  console.log('📄 Пользователи в БД:', users.map((u) => u.id))

  const listId = 'list_1'
  console.log(`📋 Создаём список: ${listId}`)
  await db.collection('lists').doc(listId).set({
    owner_id: uid,
    title: 'My List',
    color: '#4CAF50',
    icon: 'list',
    is_archived: false,
    order: 0,
    created_time: new Date(),
    updated_time: new Date(),
    task_count: 0,
  })
  const lists = await db.collection('lists').listDocuments()
  console.log('📄 Списки в БД:', lists.map((l) => l.id))

  const taskId = 'task_1'
  console.log(`✅ Создаём задачу: ${taskId}`)
  await db.collection('tasks').doc(taskId).set({
    list_id: listId,
    owner_id: uid,
    title: 'Test task',
    is_completed: false,
    created_time: new Date(),
    updated_time: new Date(),
    order: 0,
    due_date: new Date(Date.now() + 3600000),
    priority: 'medium',
    notes: '',
  })
  const tasks = await db.collection('tasks').listDocuments()
  console.log('📄 Задачи в БД:', tasks.map((t) => t.id))

  console.log('🔔 Создаём напоминание...')
  await db.collection('reminders').doc('rem_1').set({
    task_id: taskId,
    owner_id: uid,
    trigger_time: new Date(Date.now() + 3000000),
    is_sent: false,
    type: 'task_due',
    created_time: new Date(),
  })
  const reminders = await db.collection('reminders').listDocuments()
  console.log('📄 Напоминания в БД:', reminders.map((r) => r.id))

  console.log('🎉 Все данные успешно загружены в эмулятор!')
}

seed().catch((err) => {
  console.error('💥 Ошибка:', err)
  process.exit(1)
})
