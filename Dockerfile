# Используем официальное Node.js изображение
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код приложения
COPY . .

# Открываем порт приложения
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]