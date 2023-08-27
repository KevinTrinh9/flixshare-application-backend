DROP DATABASE IF EXISTS flixsharedb;

CREATE DATABASE flixsharedb;

\c flixsharedb;

DROP TABLE IF EXISTS users;

-- Create 'users' table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);