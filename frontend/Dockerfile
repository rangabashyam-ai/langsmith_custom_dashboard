FROM node:16.20.2-alpine AS builder
 
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directoryCOPY package.json .
COPY package.json .
COPY package-lock.json .

RUN rm -rf node_modules package-lock.json
RUN npm install --legacy-peer-deps
RUN npm install ajv --legacy-peer-deps
# Copy the remaining application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the React app
CMD ["npm", "start"]


# # Step 1: Build the React app
# FROM node:16.20.2-alpine AS builder

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package.json .
# COPY package-lock.json .

# # Install dependencies
# RUN npm install --legacy-peer-deps

# # Copy the remaining application code to the working directory
# COPY . .

# # Build the React app
# RUN npm run build

# # Expose port 3000 to the outside world
# EXPOSE 3000

# # Command to run the React app
# CMD ["npm", "start"]

