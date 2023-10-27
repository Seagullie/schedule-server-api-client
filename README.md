# Клієнт для API зі розкладами

Цей клієнт дозволяє працювати із API на [сервері зі розкладами.](<[https://github.com/bind-w-exit/InteractiveScheduleUad.]()>)

Клієнт автозгенеровано [цією Java програмою](https://github.com/OpenAPITools/openapi-generator) за допомогою [цієї node обгортки](https://www.npmjs.com/package/@openapitools/openapi-generator-cli).

Автогенерація є можливою завдяки архітектурі серверної програми, яка використовує стандарт для API, `OpenAPI`.

Приклад використання клієнта тут: `src/example.ts`

## Структура

Після генерації створюється чотири TypeScript файли:

1. **Api**. Цей файл містить функції та класи, які можна використовувати для надсилання запитів до сервера. Він має дві різні реалізації для різних стилів програмування: класи для ООП та функції для функц. програмування. Він також включає моделі об'єктів даних, що надсилаються до сервера або отримуються з нього.
2. **Base**. Цей файл оголошує дві речі: шлях до серверної програми та базовий клас для всіх класів API. Базовий клас приймає конфігурацію, яка вказується перед використанням API.
3. **Common**. У цьому файлі зберігаються невеликі утиліти, які використовуються всередині клієнта.
4. **Configuration**. Цей файл визначає параметри конфігурації для клієнта. Він надає інтерфейс для вказівки ключа API, імені користувача, пароля, токену доступу, базового шляху та інших параметрів, необхідних для здійснення запитів до API.

Для того, щоб використовувати клієнт, необхідно імпортувати клас або функцію API з файлу `Api`, а також клас конфігурації з файлу `Configuration`. Для здійснення http-запитів клієнт використовує бібліотеку `axios`, яка працює як в середовищі браузера, так і в node середовищі.

## Тести

Щоб запустити тести, необхідно заповнити `.env `згідно зі `.env.example`

Всього ендпойнтів: ~10

Покрито тестами:

1. /api/Teacher

## Пакунок

Встановлюється у веб проджект:

```
npm install Seagullie/schedule-server-api-client
```