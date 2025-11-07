FROM node:20

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

ARG COINGECKO_API_KEY
ENV COINGECKO_API_KEY=$COINGECKO_API_KEY

COPY package*.json ./
RUN bun install

COPY . .

# Build TypeScript
RUN bun run build

EXPOSE 4000

CMD ["bun", "start"]