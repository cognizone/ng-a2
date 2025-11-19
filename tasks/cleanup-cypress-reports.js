const fs = require('fs');
const path = require('path');

const jsonsDir = path.join(__dirname, '../cypress/reports/.jsons');

// Clean up old JSON files from previous runs
if (fs.existsSync(jsonsDir)) {
  const files = fs.readdirSync(jsonsDir);
  let deletedCount = 0;
  files.forEach(file => {
    if (file.endsWith('.json')) {
      fs.unlinkSync(path.join(jsonsDir, file));
      deletedCount++;
    }
  });
  if (deletedCount > 0) {
    console.log(`🧹 Cleaned up ${deletedCount} old JSON report file(s)`);
  }
}
