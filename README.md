# NestJS PostgreSQL

Простое backend приложение на базе NestJS, где в качестве базы данных выступает PostgreSQL. Все это упаковано в docker-compose

<table width="100%">
  <tr>
    <td align="center" valign="middle" width="17%">
      <a href="https://nestjs.com/">
        <img height="50" alt="NestJS" src="https://hsto.org/getpro/habr/post_images/d11/98b/ac8/d1198bac8e4ced0d89d5e5983061f418.png"/>
      </a>
      <br />
      NestJS
    </td>
    <td align="center" valign="middle" width="17%">
      <a href="https://www.postgresql.org/">
      <img height="50" alt="PostgresSQL" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/640px-Postgresql_elephant.svg.png"/>
      </a>
      <br />
      PostgresSQL
    </td>
  </tr>
</table>

## Метод установки и запуска

Скопируйте к себе репозиторий

```shell
git clone https://github.com/chebok/social-web.git
```

Создайте в корне репозитория .env файл, или воспользуйтесь .env example:

```dotenv
API_PORT=3001
JWT_SECRET=secret

DB_USER=admin
DB_PASSWORD=admin
DB_YELLOW_HOST=0.0.0.0
DB_YELLOW_PORT=5432
DB_PURPLE_HOST=0.0.0.0
DB_PURPLE_PORT=5434
DB_NAME=social_web

RABBITMQ_HOST=0.0.0.0
RABBITMQ_PORT=5672
RABBITMQ_PORT_MANAGEMENT=15672
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=admin

RABBIT_FEED_QUEUE=feed_queue

REDIS_HOST=0.0.0.0
REDIS_PORT=6379
```
## Документация OPENapi (Swagger)

Доступна на адресе /api-docs

### С использованием Docker

Убедитесь что у вас установлен Docker (Docker не поддерживается семейством операционных систем Windows, за исключением
Windows-Professional или Корпоративная, т.к. для работы необходим Hyper-V, о чем сказано на сайте
в [документации](https://docs.microsoft.com/ru-ru/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v#check-requirements)
Microsoft)
Выполните команду:

```shell
docker compose up --build
# -d - для запуска в фоне
# --build - для повторной пересборки контейнеров
```

### Без Docker

- Создайте экземпляр сервера и базу данных, добавьте пользователя и пароль как указано в .env файле
- Убедитесь что postgreSQL запущен и работает
- Выполните установку зависимостей

### Backend
```shell
cd backend/

# npm package manager
npm install
npm run start
``