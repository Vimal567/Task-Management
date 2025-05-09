const jwt = require('jsonwebtoken');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '4h' });
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month (months are 0-based)
  const year = date.getFullYear(); // Get the full year

  return `${day}-${month}-${year}`;
};


const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

const processExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet);
};

const processCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const readable = Buffer.from(buffer).toString('utf-8');

    const lines = readable.split('\n');

    // Skip the first line (header row)
    lines.forEach((line, index) => {
      if (index === 0) return;

      const columns = line.split(',');
      if (columns.length > 1) {
        // Parse and map the data to task object
        results.push({
          "Task Name": columns[1], // Task Name
          "Description": columns[2], // Description
          "Days": columns[3], // Days
          "Due Date": columns[4] // Due Date
        });
      }
    });

    resolve(results);
  });
};


module.exports = { generateToken, processExcel, processCSV, upload, formatDate };