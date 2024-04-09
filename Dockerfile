FROM node:20 AS base

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i

FROM base AS build

WORKDIR /usr/src/app

COPY . .

COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN npm run build
RUN npm prune --prod

FROM node:20-alpine3.19 AS deploy

WORKDIR /usr/src/app

RUN npm i -g prisma tsx

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/src/lib ./src/lib

EXPOSE 3000

CMD ["npm", "start"]
