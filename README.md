# UTA Doubles Tournament Registration Portal

A web application for managing doubles tennis tournament registrations at the University of Texas at Arlington.

## Features

- User registration and authentication
- Tournament registration
- Team management
- Match scheduling
- Results tracking
- Admin dashboard

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: MySQL
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/uta-doubles-tournament.git
cd uta-doubles-tournament
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in the backend directory
- Update the database credentials in `.env`

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 