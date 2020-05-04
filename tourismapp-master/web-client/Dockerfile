FROM node
RUN mkdir -p /src/app
WORKDIR /src/app

COPY package.json /src/app/
RUN npm install
copy . /src/app
EXPOSE 3000
CMD ["npm", "start"]
