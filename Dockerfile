FROM node:16-alpine AS build-env

ENV NEXT_TELEMETRY_DISABLED 1

COPY . /app
WORKDIR /app

COPY /package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs:16 AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=build-env /app/next.config.js ./
COPY --from=build-env /app/public ./public
COPY --from=build-env /app/.next ./.next
COPY --from=build-env /app/node_modules ./node_modules

CMD ["./node_modules/next/dist/bin/next", "start"]
