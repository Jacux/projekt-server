var express = require('express');
var router = express.Router();
let axios = require('axios');

// Funkcja do wysyłania zapytania do Open-Meteo API
async function getSolarData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=Europe%2FBerlin`;

  console.log(apiUrl)

  try {
      const response = await axios.get(apiUrl); // Użyj axios zamiast fetch
      return response.data; // Zakładamy, że API zwraca dane w formacie JSON
  } catch (error) {
      console.error('Error fetching solar data:', error);
  }
}

// Funkcja do obliczania przewidywanej produkcji energii
function calculateEnergyProduction(solarData, panelPower, panelArea) {
  const dailyData = solarData.daily; // Dzienna prognoza
  const totalEnergyProduced = dailyData.sunrise.map((sunrise, index) => {
      const sunset = dailyData.sunset[index];
      const hoursOfSunlight = (new Date(sunset) - new Date(sunrise)) / 3600000; // Przekształcenie z ms na godziny
      return (panelPower * panelArea) * hoursOfSunlight; // kWh
  }).reduce((total, dailyProduction) => total + dailyProduction, 0);
  
  return totalEnergyProduced;
}

// Główna funkcja
async function main(res) {
  const latitude = 52.2297; // Wstaw odpowiednią szerokość geograficzną (Warszawa)
  const longitude = 21.0122; // Wstaw odpowiednią długość geograficzną (Warszawa)
  const panelArea = 10; // Powierzchnia paneli w m² (przykład)
  const panelEfficiency = 0.3; // Efektywność panelu w kW/m² (300 W/m²)
  const panelPower = panelEfficiency; // Moc panelu w kW na m ²
  
  // Pobierz dane o nasłonecznieniu
  const solarData = await getSolarData(latitude, longitude);
  
  // Oblicz przewidywaną produkcję energii
  const energyProduced = calculateEnergyProduction(solarData, panelPower, panelArea);
  res.send(`Przewidywana produkcja energii przez panele słoneczne: ${energyProduced.toFixed(2)} kWh`);
  console.log(`Przewidywana produkcja energii przez panele słoneczne: ${energyProduced.toFixed(2)} kWh`);
}

// Uruchom główną funkcję

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    await main(res);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;