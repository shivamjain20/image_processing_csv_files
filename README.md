# Image Processing System

## Introduction

This project implements a system for processing image data from CSV files asynchronously. It provides APIs to upload CSV files, monitor processing status, and retrieve the processed image results.

## Features

- **Upload API:** Accepts CSV files and generates a unique request ID.
- **Status API:** Allows checking the processing status using the request ID.

## API Endpoints

### Upload API

- **Endpoint:** `/upload`
- **Method:** POST
- **Request Payload:** Form-data with `csvFile` field containing the CSV file.
- **Response:** JSON with `requestId` upon successful upload.

### Status API

- **Endpoint:** `/status/:requestId`
- **Method:** GET
- **Request Params:** `requestId` (String)
- **Response:** JSON with `status` of the processing request (`PENDING`, `PROCESSING`, `COMPLETED`).
- **Functionality:** Downloads images from URLs, resizes them, and updates database records with processed image URLs.

## Installation and Setup

1. Clone the repository: `git clone [repository_url]`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file.
4. Start the server: `npm start`

## Technologies Used

- Node.js
- Express.js
- Sequelize (SQL ORM)
- Axios
- Sharp (Image Processing)
- MySQL (Database)
- Render.com (Deployment)

Deploy link: https://image-processing-csv-files.onrender.com
