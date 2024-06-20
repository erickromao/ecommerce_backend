FROM node:22.3.0 AS build

COPY src /app/src
COPY package*.json ./

WORKDIR  /app

RUN npm install

COPY . .

FROM node:22.3.0

WORKDIR /APP

COPY --from=build /app .

RUN npm install --only=production

EXPOSE 8080

CMD ["npm", "start"]
