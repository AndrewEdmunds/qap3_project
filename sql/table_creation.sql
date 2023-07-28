CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tasks (
  task_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  task_name VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'Todo'
);

/* I ended up not making as detailed of a project as I was going to, so the tasks table is actually useless in the context of this project*/