const express = require('express');
const path = require('path');

const app = express();
const port = 3006; // Change this to the desired port number

// Serve static files from the "static" folder
app.use(express.static(path.join(__dirname, 'static')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
