# Build Frontend
FROM node:18 AS frontend-builder
WORKDIR /app/front
COPY front/package.json front/package-lock.json ./
RUN npm install
COPY front ./
RUN npm run build

# Build Backend
FROM node:18 AS backend
WORKDIR /app
COPY back/package.json back/package-lock.json ./
RUN npm install
COPY back ./

# Copy frontend build to backend
COPY --from=frontend-builder /app/front/dist ./dist


EXPOSE 3000
CMD ["npm", "start"]