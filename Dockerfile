FROM node:16-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY --chown=node:node . .

USER node

FROM node:16-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm install -g pnpm
RUN pnpm build

ENV NODE_ENV production

RUN pnpm install

USER node

FROM node:16-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
