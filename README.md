# Interactive Online Technologies — Test Suite

Playwright + TypeScript. Page Object Model, смешанный подход: UI (E2E) + API.

## Запуск

```bash
cp .env.example .env   # заполнить переменные
npm install
npx playwright test
npx playwright show-report
```

## Переменные окружения (.env)

| Переменная | Описание |
|---|---|
| `BASE_URL` | URL приложения |
| `ACCESS_KEY` | X-Access-Key из заявки |
| `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | Учётные данные тестового пользователя |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Учётные данные администратора из заявки |
| `ANALYTICS_USER` / `ANALYTICS_PASSWORD` | Basic Auth для аналитики |

## Что покрыто

41 тест суммарно.

| Область | Подход | Кол-во тестов |
|---|---|---|
| Регистрация | UI + API | 7 + 1 |
| Логин / Логаут | UI | 6 |
| Дашборд (todos, теги) | UI + API | 5 + 2 |
| Профиль (имя, фото, пароль, аналитика) | UI | 8 |
| Аналитика | API | 5 |
| Админ-панель | UI | 4 |

## Архитектурные решения

**globalSetup + storageState** — логин выполняется один раз перед всем запуском, сессия сохраняется в `.auth/`. Тесты дашборда и профиля стартуют уже авторизованными.

**API-тесты вместо UI там, где нужно** — два сценария (редактирование todo, todo с тегом) перенесены на API уровень из-за rate limiting сервера. Закомментированные тесты в `todos.spec.ts` объясняют причину.

**Порядок тестов** — logout вынесен последним в `profile.spec.ts`, чтобы не инвалидировать сессию для остальных тестов.

**Admin beforeEach** — вход в админку выполняется перед каждым тестом через `beforeEach`, без сохранения сессии в файл.

## Стек

- [Playwright](https://playwright.dev/) + TypeScript
- Page Object Model (`pages/`)
- dotenv для секретов
