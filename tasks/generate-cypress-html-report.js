const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '../cypress/reports');
const jsonsDir = path.join(reportsDir, '.jsons');

// Check if JSON files exist
if (!fs.existsSync(jsonsDir)) {
  console.log('No JSON reports found. Run Cypress tests first.');
  process.exit(1);
}

const jsonFiles = fs.readdirSync(jsonsDir).filter(f => f.endsWith('.json'));

if (jsonFiles.length === 0) {
  console.log('No JSON report files found.');
  process.exit(1);
}

// Merge JSON files
const mergedJsonPath = path.join(reportsDir, 'mochawesome-report.json');
try {
  execSync(`npx mochawesome-merge "${jsonsDir}/*.json" -o "${mergedJsonPath}"`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error merging JSON files:', error.message);
  process.exit(1);
}

// Generate HTML report
try {
  execSync(`npx mochawesome-report-generator "${mergedJsonPath}" -o "${reportsDir}" --reportFilename index`, { stdio: 'inherit' });

  // Clean up merged JSON file
  if (fs.existsSync(mergedJsonPath)) {
    fs.unlinkSync(mergedJsonPath);
  }

  // Clean up old JSON files from .jsons directory (keep only latest)
  // Delete all JSON files in .jsons directory after successful HTML generation
  const files = fs.readdirSync(jsonsDir);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      fs.unlinkSync(path.join(jsonsDir, file));
    }
  });

  console.log('\n✅ HTML report generated successfully!');
  console.log(`📄 Report location: ${path.join(reportsDir, 'index.html')}`);
} catch (error) {
  console.error('Error generating HTML report:', error.message);
  process.exit(1);
}
