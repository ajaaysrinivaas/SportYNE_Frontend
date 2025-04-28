FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the files
COPY . .

# Set a default value for NEXT_PUBLIC_BACKEND_URL inside the Dockerfile
ARG NEXT_PUBLIC_BACKEND_URL=https://sportyne-backend-latest.onrender.com
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Build the Next.js app (NEXT_PUBLIC_BACKEND_URL gets inlined)
RUN yarn build

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

CMD ["yarn", "start"]
