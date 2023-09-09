const express = require('express');
const app = express();
const port = 3000; // API sunucusu için kullanacağınız port

app.use(express.json());

// Mock verileri burada tanımlayın
const mockData = require('./durations.json'); // durations.json dosyasını kullanabilirsiniz

// API endpoint'i
app.get('/durations', (req, res) => {
  res.json(mockData);
});

app.listen(port, () => {
  console.log(`Mock API sunucusu ${port} portunda çalışıyor.`);
});
