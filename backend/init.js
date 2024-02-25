import config from './backend.json' assert { type: "json" };
import DB from './db.json' assert { type: "json" };
import fs from 'fs'

const replacementMap = {
  "<MYSQL_ROOT_PWD>": DB.root_password,
  "<MYSQL_DATABASE>": DB.database,
  "<MYSQL_USER>": DB.user,
  "<MYSQL_PASSWORD>": DB.password,
  "<MYSQL_PORT>": DB.port,
  "<MYSQL_HOST>": DB.host,
  "<HOST_APPLICATION_PORT>": config.AUTH_PORT,
  "<CONTAINER_APPLICATION_PORT>": config.AUTH_PORT,
  "<MYSQL_SERVICE_NAME>": DB.service_name,
  "<MYSQL_TABLE>": DB.usertable,
  "<MYSQL_HEALTH_TABLE>": DB.health_table,
  "<SIGNALLING_SERVER_PORT>": config.SIGNALLING_PORT,
  "<CONTAINER_SIGNALLING_SERVER_PORT>": config.SIGNALLING_PORT
}

function loadEnv() {
  replaceAndSaveFile('docker-compose-template.yml', replacementMap, 'docker-compose.yml');
  replaceAndSaveFile('schema-template.sql', replacementMap, 'schema.sql');
}

// Function to load a file, replace a pattern, and save it again
function replaceAndSaveFile(filePath, replacementMap, outputPath) {
  // Read the content of the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    
    let modifiedData = data;
    for (const key of Object.keys(replacementMap)) {
      const replacement = replacementMap[key];
      modifiedData = replacePattern(modifiedData, key, replacement);
    }
    // Write the modified content back to the file
    fs.writeFile(outputPath, modifiedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log(`${filePath} has been saved to ${outputPath}`);
    });
  });
}

// Function to replace a pattern in a string
function replacePattern(originalString, pattern, replacement) {
  const regex = new RegExp(pattern, 'g');
  return originalString.replace(regex, replacement);
}

loadEnv();
