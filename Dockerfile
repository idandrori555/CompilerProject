# Use the official Deno image as the base image
FROM denoland/deno

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project to the working directory
COPY . .

# Expose the port your application runs on
EXPOSE 3000

# Set the default command to run your application
CMD ["task", "dev"]