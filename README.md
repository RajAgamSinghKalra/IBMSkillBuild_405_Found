# EmpowerYouth AI Career Coach

This project is a Next.js application that powers the **EmpowerYouth AI Career Coach** platform. It provides a web interface for users to register, receive career guidance, and explore job and course recommendations.

## Prerequisites

Before running the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or later
- [Yarn](https://classic.yarnpkg.com/) v1.22.x
- [MongoDB](https://www.mongodb.com/) running locally or accessible through `MONGO_URL`

## Setup

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Configure environment variables**

   Create a `.env` file in the project root. An example configuration is:

   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=empoweryouth_db
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   JWT_SECRET=your-secret-key
   ```

   Update any API keys or service credentials as needed.

3. **Start MongoDB (if running locally)**

   Using Docker:
   ```bash
   docker run -d -p 27017:27017 mongo
   ```

4. **Run the development server**
   ```bash
   yarn dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Production build

To create an optimized production build:

```bash
yarn build
yarn start
```

## Optional: Backend API tests

With the development server running, backend endpoints can be exercised using the provided Python script:

```bash
python backend_test.py
```

