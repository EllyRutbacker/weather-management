FROM node:20

# Create working directory in the container
WORKDIR /src/app

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Run image
CMD ["npm", "start"]