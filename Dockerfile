FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Instala as dependências de build necessárias para o sqlite3 no Alpine Linux
RUN apk add --no-cache python3 make g++

RUN npm install

COPY . .

# Compila o TypeScript (se necessário, ou usa tsx diretamente)
# CMD ["npm", "run", "dev"] para desenvolvimento

CMD ["npm", "run", "dev"]