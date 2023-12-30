# Generator File Service

This repository houses a powerful file service that offers various functionalities. Below are the key features of this service:

## Features

### 1. Screenshot Website
Capture a screenshot of a website by providing the URL. Accessible through `/v1/image`, the system will open the specified URL, take a screenshot, and provide the image URL.

#### Example CURL:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com"}' http://your-service-domain/v1/image
```

### 2. Generate PDF
Generate a PDF from a given URL, similar to the screenshot feature. Accessible through `/v1/pdf`.

#### Example CURL:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com"}' http://your-service-domain/v1/pdf
```

### 3. Upload and Compress Image
Upload PNG, JPG, JPEG, or SVG images using the `/v1/upload` endpoint. The system will compress the uploaded image into WebP format.

#### Example CURL:
```bash
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/path/to/your/image.jpg" http://your-service-domain/v1/upload
```

### 4. Convert and Compress Image from URL
Convert an image from a URL, compress it, and provide it in WebP format through the `/v1/convert-image` endpoint.

#### Example CURL:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com/image.jpg"}' http://your-service-domain/v1/convert-image
```

## Tech Stack

- Node.js v18.17.0
- TypeScript
- HTTP (Express)
- Cloud Storage (Minio)
- Docker

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayocodingit/generator-file-service.git
   cd generator-file-service
   ```

2. Create a `.env` file based on `.env.example`.

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development
```bash
npm run start:dev
```

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Lint
```bash
npm run lint
```

### Lint and Fix
```bash
npm run lint:fix
```

### Test
```bash
npm test
```

## Docker

### Build Docker Image
```bash
docker build -f docker/Dockerfile -t your-image-name:tag .
```

### Run Docker Image
```bash
docker run -p 3000:3000 your-image-name:tag
```

Adjust the port mapping according to your configuration.

Feel free to explore and utilize this versatile file service for your needs!