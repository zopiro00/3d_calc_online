const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// Function to escape file paths for CLI commands
const escapePath = (filePath) => filePath.replace(/ /g, '\\ ');

// This function enables PrusaSlicer to calculate the price using the software
const runPrusaSlicer = (filePath) => {
  return new Promise((resolve, reject) => {
    const absoluteFilePath = path.resolve(filePath);
    const outputGCodePath = absoluteFilePath.replace('.stl', '.gcode'); // Output G-code file
    const command = `"/Applications/Original Prusa Drivers/PrusaSlicer.app/Contents/MacOS/PrusaSlicer" --slice --output "${outputGCodePath}" "${absoluteFilePath}"`;

    console.log(`Executing slicing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Slicing error:', error.message);
        return reject(error);
      }
      if (stderr) {
        console.warn('PrusaSlicer stderr:', stderr);
      }

      console.log('Slicing output:', stdout);

      // Parse estimated time from stdout (example logic)
      const timeMatch = stdout.match(/estimated printing time:\s*(.+)/i);
      const estimatedTime = timeMatch ? timeMatch[1] : 'Unknown';

      console.log('Estimated printing time:', estimatedTime);
      resolve({ estimatedTime, outputGCodePath });
    });
  });
};

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests only from your frontend
    methods: ['GET', 'POST'], // Allow specific methods
    allowedHeaders: ['Content-Type'], // Allow specific headers
  })
);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to handle file uploads and parameter processing
app.post('/calculate', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { material, quality, supports } = req.body;

    console.log('File received:', file);
    console.log('Parameters:', { material, quality, supports });

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Validate file extension
    const validExtensions = ['stl', 'obj', '3mf'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      return res.status(400).json({
        error:
          'Unsupported file format. Please upload a .stl, .obj, or .3mf file.',
      });
    }

    // Rename the file to include the correct extension
    const newFilePath = `${file.path}.${fileExtension}`;
    fs.renameSync(file.path, newFilePath);
    console.log('File renamed to:', newFilePath);

    const absoluteFilePath = path.resolve(newFilePath);
    console.log('Absolute file path:', absoluteFilePath);

    // Check if the file exists before proceeding
    if (!fs.existsSync(absoluteFilePath)) {
      console.error('File does not exist at:', absoluteFilePath);
      return res
        .status(400)
        .json({ error: 'File does not exist. PrusaSlicer cannot process it.' });
    }

    // Run PrusaSlicer and get output
    const slicerOutput = await runPrusaSlicer(absoluteFilePath);

    // Placeholder for parsing output (to be implemented later)
    console.log('Slicer Output:', slicerOutput);
    const parsedData = {}; // Replace with actual parsing logic

    // Placeholder for pricing logic (to be implemented later)
    const totalPrice = 0; // Replace with actual pricing calculation logic

    // Respond with parsed data and price
    res.json({ parsedData, totalPrice });

    // Clean up uploaded file
    fs.unlink(newFilePath, (err) => {
      if (err) console.error('Error deleting file:', err.message);
      else console.log('File deleted:', newFilePath);
    });
  } catch (error) {
    console.error('Error in /calculate route:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the 3D Print Price Calculator Backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
