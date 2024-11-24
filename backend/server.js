const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { runPrusaSlicer } = require('./prusaService/slicerService');
const { calculatePrice } = require('./util/pricing');
const { renameFileWithExtension, deleteFiles } = require('./util/fileUtils');
const { generateConfig } = require('./prusaService/prusaUtils');
const app = express();
const dotenv = require('dotenv');
const { validateEnvVariables } = require('./config/envValidator');

dotenv.config(); // Load environment variables from .env
// Validate required environment variables
const REQUIRED_ENV_VARS = ['PRUSA_SLICER_PATH', 'PORT'];
validateEnvVariables(REQUIRED_ENV_VARS);

const PRUSA_SLICER_PATH = process.env.PRUSA_SLICER_PATH;
const PORT = process.env.PORT || 5001;

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
    const { file } = req;
    const { material = 'PLA', quality = 'medium', supports = 'no' } = req.body;

    const validExtensions = ['stl', 'obj', '3mf'];
    const filePath = renameFileWithExtension(file, validExtensions);

    const configPath = generateConfig(
      quality.toLowerCase(),
      supports.toLowerCase()
    );

    const { estimatedTime, filamentUsed } = await runPrusaSlicer(
      filePath,
      configPath,
      PRUSA_SLICER_PATH
    );

    const totalPrice = calculatePrice(
      { filamentUsed, estimatedTime },
      material,
      quality,
      supports
    );

    res.json({ estimatedTime, filamentUsed, totalPrice });

    await deleteFiles([filePath, configPath]);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Internal Server Error', message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the 3D Print Price Calculator Backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
