# Репликация в PostgreSQL
## Физическая репликация

1. Меняем postgresql.conf на мастере(pg_yellow) в pgdata-yellow
    ```conf
    ssl = off
    wal_level = replica
    max_wal_senders = 4 # expected slave num

2. Подключаемся к мастеру(pg_yellow) и создаем пользователя для репликации
    ```shell
    docker exec -it pg_yellow psql -U admin -d social_web
    create role replicator with login replication password 'pass';
    exit
    ```
3. Запоминаем маску сети
    ```shell
    docker network inspect social-web_default | grep Subnet # Запомнить маску сети
    ```

4. Добавляем запись в `pgdata-yellow/pg_hba.conf` с `subnet` из прошлого пункта.
    ```
    host    replication     replicator       __SUBNET__          md5
    ```

5. Перезапустим мастер(pg_yellow)
    ```shell
    docker restart pg_yellow
    ```

6. Сделаем бэкап для реплик
    ```shell
    docker exec -it pgmaster bash
    mkdir /pgslave
    pg_basebackup -h pgmaster -D /pgslave -U replicator -v -P --wal-method=stream
    exit
    ```
7. Копируем директорию себе для нового инстанса `pg_blue`
    ```shell
    docker cp pg_yellow:/pgslave pgdata-blue/
    ```

8. Создадим файл, чтобы pg_blue узнала, что она реплика
    ```shell
    touch pgdata-blue/standby.signal
    ```
9. Меняем `postgresql.conf` на реплике `pg_blue`
    ```conf
    primary_conninfo = 'host=pg_yellow port=5432 user=replicator password=pass application_name=pg_blue'
    ```
10. Добавляем реплику `pg_blue` в docker compose как еще один сервис и запускаем сразу оба инстанса оттуда.
    ```yml
    container_name: pg_blue
    image: postgres:16
    restart: always
    ports:
      - ${DB_BLUE_PORT}:5432
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - ./pgdata-blue:/var/lib/postgresql/data/pgdata
    ```
11. Убеждаемся что `pg_blue` работает как реплика в асинхронном режиме на `pg_yellow`
    ```shell
    docker exec -it pg_yellow psql -U admin -d social_web
    select application_name, sync_state from pg_stat_replication;
    exit;
    ```

12. Запустим вторую реплику `pg_purple`
    - скопируем бэкап
        ```shell
        docker cp pg_yellow:/pgslave pgdata-purple/
        ```

    - изменим настройки `pgdata-purple/postgresql.conf`
        ```conf
        primary_conninfo = 'host=pg_yellow port=5432 user=replicator password=pass application_name=pg_purple'
        ```

    - дадим знать что это реплика
        ```shell
        touch pgdata-purple/standby.signal
        ```

    - добавляем реплику `pg_purple` в docker compose как еще один сервис и запускаем сразу оттуда.
        ```yml
        container_name: pg_purple
        image: postgres:16
        restart: always
        ports:
          - ${DB_PURPLE_PORT}:5432
        environment:
          POSTGRES_DB: ${DB_NAME}
          POSTGRES_USER: ${DB_USER}
          POSTGRES_PASSWORD: ${DB_PASSWORD}
          PGDATA: /var/lib/postgresql/data/pgdata
        volumes:
          - ./pgdata-purple:/var/lib/postgresql/data/pgdata
        ```

13. Убеждаемся что обе реплики работают в асинхронном режиме на `pg_yellow`
    ```shell
    docker exec -it pg_yellow psql -U admin -d social_web
    select application_name, sync_state from pg_stat_replication;
    exit;
    ```

14. Включаем синхронную репликацию на `pg_yellow`
    - меняем файл `pgdata-yellow/postgresql.conf`
        ```conf
        synchronous_commit = on
        synchronous_standby_names = 'FIRST 1 (pg_blue, pg_purple)'
        ```

    - перечитываем конфиг
        ```shell
        docker exec -it pg_yellow psql -U admin -d social_web
        select pg_reload_conf();
        exit;
        ```

15. Убеждаемся, что реплика стала синхронной
    ```shell
    docker exec -it pg_yellow psql -U admin -d social_web
    select application_name, sync_state from pg_stat_replication;
    exit;
    ```

16. Запромоутим реплику `pg_blue`
    ```shell
    docker exec -it pg_blue psql -U admin -d social_web
    select pg_promote();
    exit;
    ```

17. Настраиваем репликацию на `pg_blue` (`pgdata-blue/postgresql.conf`)
    - изменяем конфиг
        ```conf
        synchronous_commit = on
        synchronous_standby_names = 'ANY 1 (pg_purple, pg_yellow)'
        ```
    - перечитываем конфиг
        ```shell
        docker exec -it pg_blue psql -U admin -d social_web
        select pg_reload_conf();
        exit;
        ```
18. Подключим вторую реплику `pg_purple` к новому мастеру `pg_blue`
    - изменяем конфиг `pgdata-purple/postgresql.conf`
        ```conf
        primary_conninfo = 'host=pg_blue port=5432 user=replicator password=pass application_name=pg_purple'
        ```
    - перечитываем конфиг
        ```shell
        docker exec -it pg_purple psql -U admin -d social_web
        select pg_reload_conf();
        exit;
        ```
19. Проверяем что к новому мастеру `pg_blue` подключена реплика и она работает
    ```shell
    docker exec -it pg_blue psql -U admin -d social_web
    select application_name, sync_state from pg_stat_replication;
    select count(*) from test_table_1;
    exit;
    docker exec -it pg_purple psql -U admin -d social_web
    select count(*) from test_table_1;
    exit;
    ```