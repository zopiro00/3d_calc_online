// prusaService/slicerService.js
// Slice the stl file and then provides a GCODE, an estimated time and a filament lenght

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Parses the G-code file for time and filament usage
const parseGCodeForTimeAndFilament = (gcodePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(gcodePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading G-code file:', err.message);
        return reject('Failed to read G-code file');
      }

      const timeMatch = data.match(
        /; estimated printing time \(normal mode\) = (\d+h \d+m \d+s)/i
      );
      const estimatedTime = timeMatch ? timeMatch[1] : 'Unknown';

      const filamentMatch = data.match(/; filament used \[mm\] = ([\d.]+)/i);
      const filamentUsed = filamentMatch ? parseFloat(filamentMatch[1]) : 0;

      resolve({ estimatedTime, filamentUsed });
    });
  });
};

// Runs PrusaSlicer with the provided file and config
const runPrusaSlicer = (filePath, configPath, slicerPath) => {
  return new Promise((resolve, reject) => {
    const absoluteFilePath = path.resolve(filePath);
    const outputGCodePath = absoluteFilePath.replace('.stl', '.gcode');
    const command = `"${slicerPath}" --slice --output "${outputGCodePath}" --load "${configPath}" "${absoluteFilePath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      parseGCodeForTimeAndFilament(outputGCodePath)
        .then(({ estimatedTime, filamentUsed }) => {
          resolve({ estimatedTime, filamentUsed, outputGCodePath });
        })
        .catch(reject);
    });
  });
};

module.exports = { runPrusaSlicer };
