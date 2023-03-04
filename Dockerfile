FROM node:18-alpine

WORKDIR /app

COPY ./package*.json ./
COPY ./prisma ./prisma/

RUN npm ci --silent

COPY . .

RUN npm run build && npm prune --production

CMD [ "npm", "run", "start:prod" ]
