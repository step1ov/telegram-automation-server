# Telegram Automation Server

Server for Telegram Automation app, based on [Nest](https://github.com/nestjs/nest).

## Перед установкой

Для работы сервера необходимо передать ряд параметров (настройки подключения к базе данных, серверу почтовой рассылки и др.) в переменных окружения.
Файл с переменными окружения должен иметь имя **.env** и располагаться в корневом каталоге проекта сервера.
Пример файла с переменными окружения **.env**:

```bash
# Порт сервера, при необходимости
PORT=5005

# Учетные данные для подключения к базе данных Mongo DB
MONGODB_DATABASE="betalife"
MONGODB_URI="clusterbetalife.123abc.mongodb.net"
MONGODB_USER="admin"
MONGODB_PASS="somePassword"
# Обязательно указать порт, для Mongo DB, если не используется облако mongodb.net
MONGODB_PORT=27017

# Учетные данные для сервера почтовой рассылки
MAIL_HOST="some.mail.host.com"
MAIL_PORT=465
MAIL_USER="sender@host.com"
MAIL_PASS="somePassword"

# Адрес фронтенда админки (нужен для формирования URL восстановления пароля)
ADMIN_PANEL_URL="http://localhost:3000"
# Произвольный ключ для шифрования email при восстановлении пароля
EMAIL_ENCRYPT_SECRET_KEY=12J38&91hd7GaKsd$h12635kja9df
```

## Установка
Для установки пакетов перейдите в каталог проекта и выполните команду
```bash
$ yarn
```
либо
```bash
$ npm install
```

## Запуск и билд
Для запуска приложения в режиме отладки выполните команду
```bash
# development
# watch mode
$ yarn start:dev
```
либо
```bash
$ npm run start:dev
```
Для билда и запуска приложения вызовите
```bash
# production mode
$ yarn build
$ yarn start:prod
```
либо
```bash
# production mode
$ npm run build
$ npm run start:prod
```
