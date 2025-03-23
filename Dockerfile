FROM node:22.11.0 AS builder

WORKDIR /app

COPY package.json .

RUN npm i -g pnpm
RUN pnpm install 

COPY . .

RUN npm run build

FROM node:22.11.0 AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json .

EXPOSE 3000

CMD ["pnpm", "start"]
