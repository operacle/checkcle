# syntax=docker/dockerfile:1.7
FROM node:20-bullseye-slim AS build
WORKDIR /app
ENV npm_config_fund=false \
    npm_config_audit=false \
    npm_config_progress=false
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --fund=false
COPY . .
RUN --mount=type=cache,target=/root/.npm npm run build

FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback + asset caching
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri $uri/ /index.html; }\n  location ~* \\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ { expires 7d; add_header Cache-Control "public, max-age=604800, immutable"; try_files $uri =404; }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
