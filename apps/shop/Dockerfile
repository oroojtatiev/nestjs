# BUILD FOR LOCAL DEVELOPMENT
FROM node:18 As development

WORKDIR /usr/src/app

COPY --chown=node:node ../../package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY --chown=node:node ../.. .

USER node

# BUILD FOR PRODUCTION
FROM node:18 As build

WORKDIR /usr/src/app

COPY --chown=node:node ../../package.json pnpm-lock.yaml ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node ../.. .

RUN npm install -g pnpm
RUN pnpm build

ENV NODE_ENV production

RUN pnpm install --prod

USER node

# PRODUCTION
FROM node:18 As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/shop/main.js" ]
