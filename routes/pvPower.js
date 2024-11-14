var express = require("express");
var router = express.Router();
let axios = require("axios");

async function getSolarData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=Europe%2FBerlin`;

  console.log(apiUrl);

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching solar data:", error);
  }
}

function calculateEnergyProduction(solarData, panelPower, panelArea) {
  const dailyData = solarData.daily;
  const totalEnergyProduced = dailyData.sunrise
    .map((sunrise, index) => {
      const sunset = dailyData.sunset[index];
      const hoursOfSunlight = (new Date(sunset) - new Date(sunrise)) / 3600000;
      return panelPower * panelArea * hoursOfSunlight;
    })
    .reduce((total, dailyProduction) => total + dailyProduction, 0);

  return totalEnergyProduced;
}

async function main(res) {
  const latitude = 52.2297;
  const longitude = 21.0122;
  const panelArea = 10;
  const panelEfficiency = 0.3;
  const panelPower = panelEfficiency;

  const solarData = await getSolarData(latitude, longitude);

  const energyProduced = calculateEnergyProduction(
    solarData,
    panelPower,
    panelArea
  );
  res.send(
    `Przewidywana produkcja energii przez panele słoneczne: ${energyProduced.toFixed(
      2
    )} kWh`
  );
  console.log(
    `Przewidywana produkcja energii przez panele słoneczne: ${energyProduced.toFixed(
      2
    )} kWh`
  );
}

const pvPower = async (req, res) => {
  try {
    const response = await axios.get(apiUrl);
    const { latitude, longitude, area, efficiency } = req.body;
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=Europe%2FBerlin`;
    console.log(apiUrl);
  } catch (error) {
    res.json({ message: "Error fetching solar data:", error: error });
    console.error("Error fetching solar data:", error);
  }
};

router.get("/", async function (req, res, next) {
  try {
    await pvPower(req, res);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
