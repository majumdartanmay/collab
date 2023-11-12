-- Write the queries needed to create to the schema

-- Create users

CREATE USER IF NOT EXISTS 'collab_user' @'%' IDENTIFIED BY '<PLACEHOLDER_PWD>';
GRANT SELECT, INSERT, UPDATE, DELETE ON collab.* TO 'collab_user'@'%';
--------------------------------------------------------

-- Create Tables

CREATE TABLE IF NOT EXISTS collab.users
(
   id            INT(10) NOT NULL AUTO_INCREMENT,
   username      VARCHAR(255)
                   CHARACTER SET utf8mb4
                   COLLATE utf8mb4_0900_ai_ci
                   NOT NULL,
   secret        TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
   created_on    TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   UNIQUE KEY username_unq(username)
)
ENGINE INNODB
COLLATE 'utf8mb4_0900_ai_ci'
ROW_FORMAT DEFAULT