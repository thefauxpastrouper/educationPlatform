# Stage 1: Build the Vite app
FROM node:20 AS build

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

# Build args for Vite (must be set before build)
ARG VITE_API_BASE_URL
ARG API_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV API_KEY=$API_KEY

COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]