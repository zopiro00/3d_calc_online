// util/fileUtils.js
const fs = require('fs');
const path = require('path');

// Escape file paths for CLI commands
const escapePath = (filePath) => filePath.replace(/ /g, '\\ ');

const renameFileWithExtension = (file, validExtensions) => {
  const fileExtension = file.originalname.split('.').pop().toLowerCase();

  if (!validExtensions.includes(fileExtension)) {
    throw new Error(
      'XX Unsupported file format. Please upload a .stl, .obj, or .3mf file.'
    );
  }

  const newFilePath = `${file.path}.${fileExtension}`;
  fs.renameSync(file.path, newFilePath);

  return newFilePath;
};

const deleteFiles = async (filePaths) => {
  const deletePromises = filePaths.map((filePath) =>
    fs.promises
      .unlink(filePath)
      .catch((err) =>
        console.error('Error deleting file:', filePath, err.message)
      )
  );

  await Promise.all(deletePromises);
};

module.exports = { escapePath, renameFileWithExtension, deleteFiles };
