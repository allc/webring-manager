FROM node:23

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

ENV NEXT_PUBLIC_API_SERVER=http://localhost:3000

RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npx", "serve@latest", "out"]
