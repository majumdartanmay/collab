-- Write the queries needed to create to the schema

 CREATE USER 'collab_user'@'%' IDENTIFIED BY '_';
 GRANT SELECT, INSERT, UPDATE, DELETE ON collab.* TO 'collab_user'@'%';

 