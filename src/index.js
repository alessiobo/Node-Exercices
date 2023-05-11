const express = require('express');
const multer  = require('multer');
const path = require('path');
const planetsRouter = require('./planets');

const app = express();
const upload = multer({ dest: 'uploads/' });

// handle JSON parsing
app.use(express.json());

// handle file uploads for planet image
app.post('/planets/:id/image', upload.single('image'), (req, res, next) => {
 

  res.status(200).send('File uploaded successfully');
});

// use planets router
app.use('/planets', planetsRouter);

// handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
