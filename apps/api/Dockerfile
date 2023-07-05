FROM node:16-alpine AS builder
RUN apk update
# Set working directory
WORKDIR /app
RUN npm global add turbo
COPY . .
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:16-alpine AS installer
RUN apk update
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/npm.lock ./npm.lock
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/apps/api/prisma ./prisma
RUN npm install --frozen-lockfile
RUN npm prisma generate 


FROM node:16-alpine AS sourcer
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN npm turbo run build --scope=api --include-dependencies --no-deps

FROM node:16-alpine as runner
WORKDIR /app
COPY --from=sourcer /app/ .
CMD [ "node", "apps/api/dist/main.js" ]
