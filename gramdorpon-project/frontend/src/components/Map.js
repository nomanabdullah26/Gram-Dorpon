import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Map = ({ onVillageSelect }) => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/weather')
      .then(response => setWeatherData(response.data))
      .catch(error => console.error('ডেটা আনতে সমস্যা:', error));
  }, []);

  useEffect(() => {
    if (weatherData.length === 0) return;

    const map = L.map('map').setView([23.5, 90.0], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    weatherData.forEach(village => {
      const [lat, lng] = village.coordinates;
      
      const popupHTML = `<b>🌾 ${village.village}</b><br>Click to view 3D Dashboard`;
      const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
      marker.bindPopup(popupHTML);

      // ⭐ ক্লিক করলে পুরো ৮ দিনের ডেটা পাঠানো হচ্ছে
      marker.on('click', function() {
        const dataToSend = {
          name: village.village,
          forecast: village.forecast, // 🔥 ৮ দিনের পুরো ডেটা
          rain: (Math.random() * 5 + 1).toFixed(2) + ' mm', 
          waterLevel: (Math.random() * 2 + 3).toFixed(1) + ' ফুট',
          cropHealth: Math.floor(Math.random() * 20 + 75) + '%',
          status: Math.random() > 0.7 ? 'জরুরি' : 'সতর্ক'
        };
        onVillageSelect(dataToSend); 
      });
    });

    return () => map.remove();
  }, [weatherData, onVillageSelect]);

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
};

export default Map;