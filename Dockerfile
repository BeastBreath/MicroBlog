# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR .

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . 

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]


FROM postgres:16.1

RUN -d 
docker run -d --name postgresCont -p 5432:5432 -e POSTGRES_PASSWORD=1234 postgres:16.1
docker exec -it postgresCont bash
psql -h localhost -U postgres
CREATE DATABASE tsl_employee;






# Use the official PostgreSQL image with version 16.1
FROM postgres:16.1

# Set environment variables
ENV POSTGRES_DB tsl_employee
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 1234

# Expose the PostgreSQL default port
EXPOSE 5432

# Copy initialization scripts to Docker entrypoint directory
COPY init.sql /docker-entrypoint-initdb.d/

# Build your Docker image and run the container with the following commands:    
# docker build -t my_postgres_image .
# docker run -d --name postgresCont -p 5432:5432 my_postgres_image
