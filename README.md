# Movie Library - Full Stack Web Application

A production-ready movie library application with MongoDB backend and interactive web interface featuring full CRUD functionality.

## Project Overview

This is Assignment 3 Part 2 - a full-stack web application that demonstrates:
- Complete CRUD operations through a web interface
- RESTful API with MongoDB database
- Production deployment ready
- Environment variables configuration
- Professional frontend design with Bootstrap

## Features

### Backend (API)
- GET all movies with filtering, sorting, and projection
- GET single movie by ID
- POST create new movie
- PUT update existing movie
- DELETE remove movie
- MongoDB database integration
- Environment variables for configuration
- Error handling and validation

### Frontend (Web Interface)
- Display all movies in a responsive grid
- Create new movies via form
- Update existing movies inline
- Delete movies with confirmation
- Search and filter functionality
- **Sort movies by title, year, rating, and director**
- **Toggle ascending/descending sort order**
- Professional UI with Bootstrap
- Real-time data from backend API

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **Environment:** dotenv for configuration

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier) OR local MongoDB
- Git

## API Documentation

### Endpoints

#### GET /api/movies
Get all movies with optional filtering and sorting

**Query Parameters:**
- `genre` - Filter by genre (e.g., `?genre=Action`)
- `year` - Filter by exact year (e.g., `?year=2008`)
- `year_min` - Filter by minimum year
- `year_max` - Filter by maximum year
- `director` - Filter by director name
- `title` - Search by title
- `sortBy` - Sort field (e.g., `year`, `title`, `rating`)
- `order` - Sort order (`asc` or `desc`)
- `fields` - Select specific fields (e.g., `title,year,director`)

**Example Response:**
```json
{
  "count": 2,
  "movies": [
    {
      "_id": "1234567890",
      "title": "The Dark Knight",
      "year": 2008,
      "director": "Christopher Nolan",
      "genre": ["Action", "Crime", "Drama"],
      "rating": 9.0,
      "age_rating": "PG-13",
      "description": "Batman raises the stakes...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET /api/movies/:id
Get a single movie by ID

**Response:** Single movie object

#### POST /api/movies
Create a new movie

**Request Body:**
```json
{
  "title": "Inception",
  "year": 2010,
  "director": "Christopher Nolan",
  "genre": ["Action", "Sci-Fi", "Thriller"],
  "rating": 8.8,
  "age_rating": "PG-13",
  "description": "A thief who steals corporate secrets..."
}
```

**Required fields:** `title`, `year`

#### PUT /api/movies/:id
Update an existing movie

**Request Body:** Same as POST (all fields optional)

#### DELETE /api/movies/:id
Delete a movie

**Response:**
```json
{
  "message": "Movie deleted successfully",
  "deletedMovie": { ... }
}
```

## Project Structure

```
movie-library/
├── public/              # Static files (CSS, JS, images)
│   ├── css/
│   ├── js/
│   └── posters/
├── views/               # HTML pages
│   ├── index.html
│   ├── about.html
│   └── contact.html
├── data/                # JSON data files (fallback)
│   ├── movies.json
│   └── messages.json
├── server.js            # Main Express server
├── package.json         # Dependencies
├── .env                 # Environment variables (not in Git)
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Testing the Application

### Test CRUD Operations via Web Interface

1. **Read (GET):** Open homepage to see all movies
2. **Create (POST):** Use "Add New Movie" form
3. **Update (PUT):** Click "Edit" on any movie card
4. **Delete (DELETE):** Click "Delete" with confirmation

### Test API Endpoints

Using curl or Postman:

```bash
# Get all movies
curl http://localhost:3000/api/movies

# Get filtered movies
curl "http://localhost:3000/api/movies?genre=Action&sortBy=year&order=desc"

# Create a movie
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Movie",
    "year": 2024,
    "director": "Test Director",
    "genre": ["Drama"],
    "rating": 7.5
  }'

# Update a movie
curl -X PUT http://localhost:3000/api/movies/YOUR_MOVIE_ID \
  -H "Content-Type: application/json" \
  -d '{"rating": 8.5}'

# Delete a movie
curl -X DELETE http://localhost:3000/api/movies/YOUR_MOVIE_ID
```

## 🔒 Security Notes

- All environment variables are properly configured
- No hardcoded credentials in source code
- `.env` file is excluded from Git via `.gitignore`
- Input validation on all API endpoints
- Error handling prevents information leakage

## Differences: Local vs Production

| Aspect | Local Environment | Production Environment |
|--------|------------------|------------------------|
| **Port** | 3000 (from .env) | Dynamic (from hosting) |
| **Database** | MongoDB Atlas/Local | MongoDB Atlas |
| **Environment Variables** | From .env file | Set in hosting dashboard |
| **Node Modules** | In node_modules/ | Installed during build |
| **Hot Reload** | Yes (nodemon) | No |
| **Access** | localhost:3000 | Public URL |

## 🐛 Troubleshooting

### Database Connection Issues
```
Error: MongooseServerSelectionError: connect ECONNREFUSED
```
**Solution:** Check your `MONGO_URI` in `.env` file. Make sure:
- MongoDB Atlas cluster is running
- IP address is whitelisted (use 0.0.0.0/0 for all IPs)
- Password doesn't contain special characters

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change PORT in `.env` or kill the process using port 3000

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install`

## Author

**Albek Gusmanov**
- GitHub: Al1bek
- Student ID: 240386

## License

MIT License - feel free to use this project for learning purposes.


