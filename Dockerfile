FROM node:18-alpine as builder

ENV NODE_ENV build

# USER node
WORKDIR /app

COPY . .
RUN npm install

# COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:18-alpine

ARG STAGE=staging
ENV STAGE=${STAGE}
ENV NODE_ENV production

# USER node
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/

EXPOSE 3001

CMD ["node", "dist/main.js"]