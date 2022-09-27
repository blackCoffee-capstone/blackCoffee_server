# Production Dockerfile
# This Dockerfile allows to build a production Docker image of the NestJS application.
# It can be used to Amazon ECS task definitions to launch containers.

FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clear --force

COPY . .
RUN npm run build && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /app
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
