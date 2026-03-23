const fs = require('fs');
const path = require('path');

const directoryPath = 'c:\\Users\\Lenovo\\Shashank\\Code\\ALGOLOG\\karma\\src';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const colorsToReplace = [
  /#ff914d/gi,
  /#ff6b35/gi,
  /#ff8a2b/gi
];

const newColor = '#f59255';
let filesUpdated = 0;

walkDir(directoryPath, function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.json')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    colorsToReplace.forEach(regex => {
      if (regex.test(content)) {
        content = content.replace(regex, newColor);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesUpdated++;
      console.log('Updated:', filePath);
    }
  }
});

console.log(`Finished. Updated ${filesUpdated} files.`);
