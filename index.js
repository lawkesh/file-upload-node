const AWS = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const app = express();

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: 'ACCESS_KEY_ID',
  secretAccessKey: 'SECRET_ACCESS_KEY'
});

// Configure Multer middleware
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Allow any domain to access the resource
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Define API endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  const params = {
    Bucket: 'BUCKET_NAME',
    Key: file.originalname,
    Body: file.buffer
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    console.log(`File uploaded successfully. URL: ${data.Location}`);
    return res.status(200).send(data);
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});