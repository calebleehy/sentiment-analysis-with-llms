# Use Python image as base
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt to install dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

COPY ./data ./data

# Copy the rest of the files
COPY . .

# Expose port
EXPOSE 4000

# Start Flask server
CMD ["python", "main.py"]