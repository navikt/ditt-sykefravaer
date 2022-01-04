FROM node:16-alpine

ENV NODE_ENV production

COPY /next.config.js ./
COPY /.next ./.next
COPY /public ./public
COPY /node_modules ./node_modules
COPY /package.json ./package.json

CMD ["npm", "start"]

EXPOSE 8080
