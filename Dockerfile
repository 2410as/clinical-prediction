
FROM golang:1.25-alpine AS go-builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .


FROM node:18-alpine AS web-builder
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./  
RUN npm install # または pnpm install
COPY . .
RUN npm run build # Next.js の本番用ビルドを実行

FROM alpine:latest AS go-runtime
WORKDIR /app
COPY --from=go-builder /app/main .
EXPOSE 8080
CMD ["./main"]


FROM node:18-alpine AS web-runtime
WORKDIR /app
COPY --from=web-builder /app/package.json ./package.json
COPY --from=web-builder /app/pnpm-lock.yaml ./pnpm-lock.yaml 

RUN npm install --omit=dev

COPY --from=web-builder /app/.next ./.next
COPY --from=web-builder /app/public ./public
COPY --from=web-builder /app/next.config.mjs ./next.config.mjs
EXPOSE 3000
CMD ["npm", "start"]