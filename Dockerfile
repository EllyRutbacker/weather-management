FROM node:20

# Create working directory in the container
WORKDIR /src/app

# Copy files from app file system to container file system
COPY package.json .
COPY index.js .
COPY /src/app .

# Install dependencies
RUN npm install

# Run image
CMD ["npm", "start"]