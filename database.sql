CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  genre TEXT,
  rating REAL,
  age_rating TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO movies (title, description, year, genre, rating, age_rating) VALUES
  ('1+1', 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.', 2011, 'Drama, Comedy', 8.5, '14+'),
  ('WALL·E', 'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.', 2008, 'Animation, Adventure', 8.4, '0+'),
  ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 'Action, Crime', 9.0, '16+'),
  ('Fight Club', 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.', 1999, 'Drama, Thriller', 8.8, '18+'),
  ('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', 2014, 'Adventure, Drama', 8.6, '12+'),
  ('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 1994, 'Crime, Drama', 8.9, '18+'),
  ('Spider-Man: Across the Spider-Verse', 'Miles Morales catapults across the multiverse, where he encounters a team of Spider-People charged with protecting its very existence.', 2023, 'Animation, Action', 8.6, '12+'),
  ('Spirited Away', 'During her familys move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.', 2001, 'Animation, Adventure', 8.6, '0+');