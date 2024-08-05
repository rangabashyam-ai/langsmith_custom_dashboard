# Dockerfile for frontend
FROM node:16 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@10.8.2

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Remove default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Add a custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
