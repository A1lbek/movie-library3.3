require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const moviesFilePath = path.join(dataDir, 'movies.json');
const messagesFilePath = path.join(dataDir, 'messages.json');

function readMoviesFromFile() {
  try {
    if (!fs.existsSync(moviesFilePath)) return [];
    const data = fs.readFileSync(moviesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeMoviesToFile(movies) {
  try {
    fs.writeFileSync(moviesFilePath, JSON.stringify(movies, null, 2), 'utf8');
    return true;
  } catch (error) {
    return false;
  }
}

function readMessagesFromFile() {
  try {
    if (!fs.existsSync(messagesFilePath)) return [];
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeMessagesToFile(messages) {
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
    return true;
  } catch (error) {
    return false;
  }
}

function generateMovieId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/movies', (req, res) => {
  try {
    const movies = readMoviesFromFile();
    let filteredMovies = [...movies];

    if (req.query.genre) {
      const searchGenre = req.query.genre.toLowerCase();
      filteredMovies = filteredMovies.filter(movie => 
        movie.genre && movie.genre.some(g => g.toLowerCase().includes(searchGenre))
      );
    }

    if (req.query.year) {
      const year = parseInt(req.query.year);
      filteredMovies = filteredMovies.filter(movie => movie.year === year);
    }

    if (req.query.director) {
      const searchDirector = req.query.director.toLowerCase();
      filteredMovies = filteredMovies.filter(movie => 
        movie.director && movie.director.toLowerCase().includes(searchDirector)
      );
    }

    if (req.query.title) {
      const searchTitle = req.query.title.toLowerCase();
      filteredMovies = filteredMovies.filter(movie => 
        movie.title && movie.title.toLowerCase().includes(searchTitle)
      );
    }

    if (req.query.year_min) {
      const yearMin = parseInt(req.query.year_min);
      filteredMovies = filteredMovies.filter(movie => movie.year >= yearMin);
    }

    if (req.query.year_max) {
      const yearMax = parseInt(req.query.year_max);
      filteredMovies = filteredMovies.filter(movie => movie.year <= yearMax);
    }

    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.order === 'desc' ? -1 : 1;
      filteredMovies.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',');
      filteredMovies = filteredMovies.map(movie => {
        const projectedMovie = {};
        fields.forEach(field => {
          const trimmedField = field.trim();
          if (movie.hasOwnProperty(trimmedField)) {
            projectedMovie[trimmedField] = movie[trimmedField];
          }
        });
        if (!projectedMovie._id && movie._id) projectedMovie._id = movie._id;
        return projectedMovie;
      });
    }

    res.json({
      count: filteredMovies.length,
      movies: filteredMovies
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/movies/:id', (req, res) => {
  const movies = readMoviesFromFile();
  const movie = movies.find(m => m._id === req.params.id);
  if (!movie) return res.status(404).json({ error: 'Movie not found' });
  res.json(movie);
});

app.post('/api/movies', (req, res) => {
  const { title, year, director, genre, rating, age_rating, description } = req.body;
  
  if (!title || !year) return res.status(400).json({ error: 'Title and year are required' });
  
  const movies = readMoviesFromFile();
  
  const newMovie = {
    _id: generateMovieId(),
    title,
    year: parseInt(year),
    director: director || 'Unknown',
    genre: Array.isArray(genre) ? genre : [genre || 'Unknown'],
    rating: rating ? parseFloat(rating) : null,
    age_rating: age_rating || null,
    description: description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  movies.push(newMovie);
  
  if (writeMoviesToFile(movies)) res.status(201).json(newMovie);
  else res.status(500).json({ error: 'Failed to save movie' });
});

app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, year, director, genre, rating, age_rating, description } = req.body;
  
  const movies = readMoviesFromFile();
  const movieIndex = movies.findIndex(m => m._id === id);
  
  if (movieIndex === -1) return res.status(404).json({ error: 'Movie not found' });
  
  const updatedMovie = {
    ...movies[movieIndex],
    title: title || movies[movieIndex].title,
    year: year ? parseInt(year) : movies[movieIndex].year,
    director: director || movies[movieIndex].director,
    genre: genre ? (Array.isArray(genre) ? genre : [genre]) : movies[movieIndex].genre,
    rating: rating ? parseFloat(rating) : movies[movieIndex].rating,
    age_rating: age_rating || movies[movieIndex].age_rating,
    description: description || movies[movieIndex].description,
    updatedAt: new Date().toISOString()
  };
  
  movies[movieIndex] = updatedMovie;
  
  if (writeMoviesToFile(movies)) res.json(updatedMovie);
  else res.status(500).json({ error: 'Failed to update movie' });
});

app.delete('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  
  const movies = readMoviesFromFile();
  const movieIndex = movies.findIndex(m => m._id === id);
  
  if (movieIndex === -1) return res.status(404).json({ error: 'Movie not found' });
  
  const deletedMovie = movies.splice(movieIndex, 1)[0];
  
  if (writeMoviesToFile(movies)) res.json({ message: 'Movie deleted successfully', deletedMovie });
  else res.status(500).json({ error: 'Failed to delete movie' });
});

app.get('/api/seed', (req, res) => {
  const movies = readMoviesFromFile();
  res.json({ 
    message: 'Movies loaded from file', 
    count: movies.length,
    movies: movies
  });
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).send('Enter search term');
  
  const movies = readMoviesFromFile();
  const results = movies.filter(m => 
    m.title.toLowerCase().includes(q.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(q.toLowerCase()))
  );
  
  let html = `<h1>Search results for: ${q}</h1>`;
  results.forEach(m => {
    html += `<div style="border:1px solid #ccc;padding:15px;margin:10px;border-radius:5px;">
      <h3>${m.title} (${m.year})</h3>
      <p><strong>Director:</strong> ${m.director}</p>
      <p><strong>Genre:</strong> ${m.genre.join(', ')}</p>
      <p><strong>Rating:</strong> ${m.rating}/10</p>
      <p>${m.description ? (m.description.substring(0, 100) + '...') : 'No description'}</p>
      <a href="/item/${m._id}">View details</a></div>`;
  });
  if (results.length === 0) html += '<p>No movies found</p>';
  html += '<br><a href="/">← Back to Home</a>';
  res.send(html);
});

app.get('/item/:id', (req, res) => {
  const { id } = req.params;
  const movies = readMoviesFromFile();
  const movie = movies.find(m => m._id === id);
  
  if (!movie) return res.status(404).send('Movie not found');
  
  res.send(`
    <html>
      <head>
        <title>${movie.title}</title>
        <style>
          body { font-family: Arial; margin: 40px; }
          .movie-card { max-width: 800px; margin: 0 auto; }
          .api-link { color: #667eea; }
        </style>
      </head>
      <body>
        <div class="movie-card">
          <h1>${movie.title} (${movie.year})</h1>
          <p><strong>Director:</strong> ${movie.director}</p>
          <p><strong>Genre:</strong> ${movie.genre.join(', ')}</p>
          <p><strong>Rating:</strong> ${movie.rating}/10</p>
          <p><strong>Age Rating:</strong> ${movie.age_rating}</p>
          <p>${movie.description || 'No description available'}</p>
          <a href="/">← Back to Home</a>
          <br><br>
          <a href="/api/movies/${movie._id}" class="api-link" target="_blank">View JSON API data</a>
        </div>
      </body>
    </html>
  `);
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).send('All fields are required');
  
  const messages = readMessagesFromFile();
  const newMessage = {
    id: messages.length + 1,
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  
  if (writeMessagesToFile(messages)) res.send(`<h2>Thank you ${name}!</h2><a href="/">← Home</a>`);
  else res.status(500).send('Failed to save message');
});

app.get('/api/messages', (req, res) => {
  const messages = readMessagesFromFile();
  res.json(messages);
});

app.get('/api/info', (req, res) => {
  const movies = readMoviesFromFile();
  res.json({ 
    project: 'Movie Library', 
    version: '3.0', 
    movieCount: movies.length
  });
});

app.listen(PORT, () => {
  console.log('API endpoints:');
  console.log('   GET    /api/movies           - All movies (with filtering)');
  console.log('   GET    /api/movies/:id       - Movie by ID');
  console.log('   POST   /api/movies           - Create movie');
  console.log('   PUT    /api/movies/:id       - Update movie');
  console.log('   DELETE /api/movies/:id       - Delete movie');
  console.log('   GET    /api/seed             - Seed database');
  console.log('\nQuery examples for /api/movies:');
  console.log('   ?genre=Action               - Action movies');
  console.log('   ?year=2008                  - Movies from 2008');
  console.log('   ?director=Nolan             - Movies by Nolan');
  console.log('   ?sortBy=year&order=desc     - Sorted by year descending');
  console.log('   ?fields=title,year,director - Only title, year, director');
  console.log('\nHomepage: http://localhost:3000/');

  if (!fs.existsSync(moviesFilePath)) writeMoviesToFile([]);
});