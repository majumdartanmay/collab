# Start from Ubuntu base image FROM ubuntu:latest

# Update the package list
RUN apt-get update

# Install MySQL
RUN apt-get install -y mysql-server curl
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh > install.sh
RUN bash install.sh
RUN nvm install v14.10.0
# Create a directory for the application
RUN mkdir /app
WORKDIR /app

# Copy your application files to the container
COPY . /app

# Install your application's dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

# Start your application
CMD ["npm", "run", "dev"]
