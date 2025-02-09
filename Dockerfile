# Используем официальный образ Node.js
FROM node:20.18.0

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Собираем TypeScript-код
RUN npm run build

# Открываем порт для NestJS
EXPOSE 5000

# Запускаем приложение
CMD ["npm", "run", "start:dev"]
