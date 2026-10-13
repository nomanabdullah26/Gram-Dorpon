import React, { useState } from 'react';
import Map from './components/Map';
import VillageScene from './components/Village3D';

function App() {
  const [selectedVillage, setSelectedVillage] = useState({
    name: 'Bagbari, Bogura',
    forecast: [],
    rain: '2.45 mm',
    waterLevel: '4.5 ফুট',
    cropHealth: '৮৫%',
    status: 'সতর্ক'
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [manualWaterLevel, setManualWaterLevel] = useState(4.5); // পানির স্তর নিয়ন্ত্রণ

  React.useEffect(() => {
    if (selectedVillage.forecast && selectedVillage.forecast.length > 0) {
      setSelectedDate(selectedVillage.forecast[0].date);
    }
  }, [selectedVillage]);

  const currentWeather = selectedVillage.forecast.find(day => day.date === selectedDate);
  
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  // ✅ ম্যানুয়াল কন্ট্রোল সিমুলেশন ফাংশন (বৃষ্টি, বন্যা, খরা)
  const triggerSimulation = (type) => {
    const base = 4.5;
    let newLevel = base;
    let weatherText = currentWeather?.report || "Mostly Cloudy";
    let health = parseInt(selectedVillage.cropHealth) || 85;

    if (type === 'heavy_rain') {
      newLevel = base + 1.2;
      weatherText = "Heavy Rain";
      health = Math.max(60, health - 10); // বৃষ্টিতে ফসলের স্বাস্থ্য কিছুটা কমবে
    } else if (type === 'flood') {
      newLevel = base + 2.5;
      weatherText = "Continuous Rain (Flood Alert)";
      health = Math.max(30, health - 30); // বন্যায় ফসলের মারাত্মক ক্ষতি
    } else if (type === 'drought') {
      newLevel = base - 1.0;
      weatherText = "Scorching Sun (Drought)";
      health = Math.max(40, health - 20); // খরায় ফসল শুকিয়ে যায়
    } else {
      newLevel = base;
      health = 85; // স্বাভাবিক অবস্থায় ফসল ফিরে আসে
    }

    setManualWaterLevel(newLevel);

    // সিমুলেট করা আবহাওয়া ও ফসলের স্বাস্থ্য আপডেট করা
    setSelectedVillage(prev => ({
      ...prev,
      cropHealth: health + '%', // 🔥 ফসলের স্বাস্থ্য আপডেট
      forecast: prev.forecast.map((day, index) => 
        index === prev.forecast.findIndex(d => d.date === selectedDate) 
        ? { ...day, report: weatherText, high_c: type==='drought' ? 42 : day.high_c, low_c: type==='drought' ? 30 : day.low_c } 
        : day
      )
    }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial' }}>
      
      {/* 🔵 ম্যাপ (বাম পাশে) */}
      <div style={{ width: '50%', height: '100vh', borderRight: '2px solid #ccc' }}>
        <Map onVillageSelect={setSelectedVillage} />
      </div>

      {/* 🔴 ড্যাশবোর্ড + ৩D (ডান পাশে) */}
      <div style={{ width: '50%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f4f4' }}>
        
        <div style={{ padding: '20px', background: 'white', borderBottom: '1px solid #ddd', overflowY: 'auto' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>🌾 গ্রামদর্পণ ড্যাশবোর্ড</h2>
          
          <p><strong>গ্রাম:</strong> {selectedVillage.name}</p>
          <p><strong>পানির স্তর (ম্যানুয়াল):</strong> <span style={{color: manualWaterLevel > 5.5 ? 'red' : 'green', fontWeight: 'bold'}}>{manualWaterLevel.toFixed(1)} ফুট</span></p>
          <p><strong>ফসলের স্বাস্থ্য:</strong> <span style={{color: parseInt(selectedVillage.cropHealth) < 50 ? 'red' : (parseInt(selectedVillage.cropHealth) < 70 ? 'orange' : 'green'), fontWeight: 'bold'}}>{selectedVillage.cropHealth}</span></p>
          <p><strong>অবস্থা:</strong> <span style={{ background: manualWaterLevel > 5.5 ? '#e74c3c' : (parseInt(selectedVillage.cropHealth) < 50 ? '#e74c3c' : '#ffc107'), padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
            {manualWaterLevel > 5.5 ? 'বন্যা সতর্কতা' : (parseInt(selectedVillage.cropHealth) < 50 ? 'ফসলের ঝুঁকি' : 'সতর্ক')}
          </span></p>
          
          {selectedVillage.forecast && selectedVillage.forecast.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>📅 তারিখ নির্বাচন করুন:</label>
              <select value={selectedDate} onChange={handleDateChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                {selectedVillage.forecast.map((day, index) => (<option key={index} value={day.date}>{day.date}</option>))}
              </select>
            </div>
          )}

          {/* 🌟 ম্যানুয়াল প্রিডিকশন বাটন */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => triggerSimulation('heavy_rain')} style={{ flex: 1, padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              🌧️ মাঝারি বৃষ্টি (পরীক্ষা)
            </button>
            <button onClick={() => triggerSimulation('flood')} style={{ flex: 1, padding: '10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              ⚠️ বন্যা/টানা বৃষ্টি
            </button>
            <button onClick={() => triggerSimulation('drought')} style={{ flex: 1, padding: '10px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              ☀️ খরা (অতিরিক্ত গরম)
            </button>
          </div>

          {currentWeather && (
            <div style={{ background: manualWaterLevel > 5.5 ? '#ffebee' : '#e3f2fd', padding: '15px', borderRadius: '8px', marginTop: '15px', borderLeft: manualWaterLevel > 5.5 ? '4px solid #e74c3c' : '4px solid #1976d2' }}>
              <h4 style={{ margin: '0' }}>{manualWaterLevel > 5.5 ? '🚨 ফ্লাড অ্যালার্ট' : '🌤️ আবহাওয়া'} ({selectedDate})</h4>
              <p style={{ margin: '5px 0' }}>{currentWeather.report}</p>
              <p style={{ fontWeight: 'bold', margin: '0' }}>{currentWeather.high_c}°C / {currentWeather.low_c}°C</p>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <VillageScene weather={currentWeather?.report || ''} waterLevel={manualWaterLevel} />
        </div>

      </div>
    </div>
  );
}

export default App;