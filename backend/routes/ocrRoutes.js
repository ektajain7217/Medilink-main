const express = require('express');
const multer = require('multer');
const tesseract = require('tesseract.js');

const router = express.Router();

// Set up file upload using multer
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// OCR endpoint to process image
router.post('/ocr', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  // Use Tesseract.js to process the image
  tesseract.recognize(
    req.file.buffer, // The image file buffer
    'eng',            // Language (English in this case)
    {
      logger: (m) => console.log(m), // Log the process
    }
  )
  .then(({ data: { text } }) => {
    // Send back the recognized text as a JSON response
    res.json({ text });
  })
  .catch((error) => {
    console.error('OCR error:', error);
    res.status(500).json({ message: 'Error processing image' });
  });
});

module.exports = router;
