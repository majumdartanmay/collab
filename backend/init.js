const config = require('./backend.json');
const fs = require('fs');

const replacementMap = {
  "<MYSQL_ROOT_PWD>": config.DB.root_password,
  "<MYSQL_DATABASE>": config.DB.database,
  "<MYSQL_USER>": config.DB.user,
  "<MYSQL_PASSWORD>": config.DB.password,
  "<MYSQL_PORT>": config.DB.port,
  "<MYSQL_HOST>": config.DB.host,
  "<HOST_APPLICATION_PORT>": config.PORT,
  "<CONTAINER_APPLICATION_PORT>": config.PORT,
  "<MYSQL_SERVICE_NAME>": config.DB.service_name,
  "<MYSQL_TABLE>": config.DB.usertable,
  "<MYSQL_HEALTH_TABLE>": config.DB.health_table
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
      console.log('File has been successfully modified and saved.');
    });
  });
}

// Function to replace a pattern in a string
function replacePattern(originalString, pattern, replacement) {
  const regex = new RegExp(pattern, 'g');
  return originalString.replace(regex, replacement);
}

loadEnv();
