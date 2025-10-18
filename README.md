# turbo-todo-functions

Серверная часть для приложения Turbo TODO  
Реализовано на Firebase Functions (TypeScript), Firestore и Cloud Messaging.

---

## Возможности

- Триггеры Firestore (onCreate, onUpdate, onDelete) для задач, списков и пользователей
- Каскадное удаление связанных данных
- Автоматическое создание и очистка профилей пользователей
- Push-уведомления через FCM
- HTTP endpoints для экспорта данных и аналитики
- Плановые задачи (ежедневные напоминания, cron-очистка)
- Строгая типизация DTO и моделей

---

## Структура каталогов

functions/
├── src/
│ ├── triggers/ # Firestore-триггеры для users, tasks, lists, reminders, fcm
│ ├── scheduled/ # Плановые (cron) задачи
│ ├── http/ # HTTP endpoints
│ ├── lib/ # Утилиты: firestore, fcm, timezone, validation, инициализация SDK
│ ├── types/ # Модели и DTO
│ └── index.ts # Экспорт функций
├── test/ # Тесты
├── config/ # Конфиги и переменные окружения

text

---

## Установка и запуск

git clone git@github.com:yakut54/turbo-todo-functions.git
cd turbo-todo-functions/functions
npm install
firebase emulators:start # локальный запуск (рекомендуется)
firebase deploy --only functions

text
> Для настроек переменных окружения см. пример в `config/.env.example`

---

## Быстрый старт

1. Настрой `firebase.json`, `.firebaserc` и сервис-аккаунт под свой Firebase.
2. Установи зависимости командой `npm install`.
3. Запусти локально с помощью эмуляторов или деплой в облако.
4. Разрабатывай, добавляй функции и покрывай тестами!

---

## Контрибьюторы

- yakut54 — автор и мейнтейнер

---

## Лицензия

MIT

---
