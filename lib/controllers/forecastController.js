const jwt = require("jsonwebtoken");
const axios = require('axios')
const getForecastData = async (req, res) => {

  const {lon, lat} = req.query
  try {


    const pollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=c90f2c2db18c785adf50d710a3441904`;
    const forecastApi = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=Europe%2FBerlin&forecast_days=1`;


      const pollution = await axios.get(pollutionUrl);
      const forecast = await axios.get(forecastApi);
      return res.status(200).json({ 
        pollution: pollution.data, 
        forecast: forecast.data 
      });
      



  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getForecastData,
};
