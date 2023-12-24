CREATE DATABASE IF NOT EXISTS collab ;


-- Write the queries needed to create to the schema

-- Create users

CREATE USER IF NOT EXISTS 'collab_user' @'%' IDENTIFIED BY 'Collab_11122023';
GRANT SELECT, INSERT, UPDATE, DELETE ON collab.* TO 'collab_user'@'%';


-- Create Tables

CREATE TABLE users (
    roomId VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (roomId, username)
);

-- Create health check tables

-- Create the 'health_check' table
CREATE TABLE IF NOT EXISTS collab.collab_health_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value INT
);

-- Generate 5 rows of random data
INSERT INTO collab.collab_health_table (value) VALUES (FLOOR(RAND() * 100));
INSERT INTO collab.collab_health_table (value) VALUES (FLOOR(RAND() * 100));
INSERT INTO collab.collab_health_table (value) VALUES (FLOOR(RAND() * 100));
INSERT INTO collab.collab_health_table (value) VALUES (FLOOR(RAND() * 100));
INSERT INTO collab.collab_health_table (value) VALUES (FLOOR(RAND() * 100));

