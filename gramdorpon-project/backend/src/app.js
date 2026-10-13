const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ গ্রামদর্পণ ব্যাকএন্ড সফলভাবে চলছে!');
});

app.get('/api/weather', (req, res) => {
  try {
    // JSON ফাইলের সঠিক পাথ
    const dataPath = path.join(__dirname, '../data/weatherData.json');
    
    // ফাইল আছে কিনা চেক করা (নিরাপত্তার জন্য)
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'weatherData.json ফাইল পাওয়া যায়নি! পাথ চেক করুন।' });
    }

    // ফাইল থেকে ডেটা পড়া
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const weatherData = JSON.parse(fileContent);
    
    // সফল রেসপন্স
    res.json(weatherData);
  } catch (error) {
    console.error('❌ ব্যাকএন্ড এরর:', error.message);
    res.status(500).json({ 
      error: 'ডেটা লোড করতে ব্যর্থ হয়েছে', 
      details: error.message 
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 সার্ভার চলছে http://localhost:${PORT}`));