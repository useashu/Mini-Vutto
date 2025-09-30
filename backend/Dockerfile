FROM node:20-alpine

# Install PostgreSQL client for wait-for-postgres script
RUN apk add --no-cache postgresql-client

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Make wait script executable
RUN chmod +x wait-for-postgres.sh

EXPOSE 5001
CMD ["/bin/sh", "./wait-for-postgres.sh", "postgres", "node", "index.js"]