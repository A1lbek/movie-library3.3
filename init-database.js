const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('Initializing Movie Library database...');

const dbPath = path.join(__dirname, 'movies.db');

if (process.argv.includes('--reset') && fs.existsSync(dbPath)) {
  console.log('Removing old database...');
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
    return;
  }
  
  console.log('Connected to SQLite database');
  
  const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
  
  db.exec(sql, (err) => {
    if (err) {
      console.error('SQL execution error:', err.message);
    } else {
      console.log('Movies table created/verified');
      
      db.get('SELECT COUNT(*) as count FROM movies', (err, row) => {
        if (err) {
          console.error('Data check error:', err.message);
        } else {
          console.log(`Total movies in database: ${row.count}`);
        }
        
        db.close((err) => {
          if (err) {
            console.error('Connection close error:', err.message);
          } else {
            console.log('Database connection closed');
            console.log('Database ready. Start server with: npm run dev');
          }
        });
      });
    }
  });
});