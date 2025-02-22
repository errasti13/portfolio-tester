# S&P 500 Investment Simulator

A web application that simulates historical investment scenarios in the S&P 500 index.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd portfolio-tester
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cd backend
echo "PORT=5000" > .env
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application at `http://localhost:3000`

## Features
- Historical S&P 500 data visualization
- Investment simulation with configurable parameters
- Monte Carlo simulation with 1000 iterations
- Best/worst case scenario analysis
- Periodic investment options

## Technology Stack
- Frontend: React, Vite, Chart.js
- Backend: Express.js, Yahoo Finance API
- Styling: CSS
