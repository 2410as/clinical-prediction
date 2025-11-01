# ------------------------------------------------
# ステージ1: バックエンド (Go) ビルド用
# ------------------------------------------------
FROM golang:1.25-alpine AS go-builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# ------------------------------------------------
# ステージ2: フロントエンド (Next.js) ビルド用
# ------------------------------------------------
# "AS"でステージに名前をつける
FROM node:18-alpine AS web-builder
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./  
RUN npm install # または pnpm install
COPY . .
RUN npm run build # Next.js の本番用ビルドを実行

# ------------------------------------------------
# ステージ3: 最終 (Go実行用) イメージ
# ------------------------------------------------
# ※ "api" サービスはこのステージを使う
FROM alpine:latest AS go-runtime
WORKDIR /app
COPY --from=go-builder /app/main .
EXPOSE 8080
CMD ["./main"]

# ------------------------------------------------
# ステージ4: 最終 (Next.js実行用) イメージ
# ------------------------------------------------
# ※ "web" サービスはこのステージを使う
FROM node:18-alpine AS web-runtime
WORKDIR /app
COPY --from=web-builder /app/package.json ./package.json
COPY --from=web-builder /app/pnpm-lock.yaml ./pnpm-lock.yaml 
# ★★★ これを追加！ ★★★
# 本番（実行）に必要なライブラリだけをインストール
RUN npm install --omit=dev

# ビルド結果と設定ファイルをコピー
COPY --from=web-builder /app/.next ./.next
COPY --from=web-builder /app/public ./public
COPY --from=web-builder /app/next.config.mjs ./next.config.mjs
EXPOSE 3000
CMD ["npm", "start"]