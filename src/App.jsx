import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("phnom penh");
  const [forecast, setForecast] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchWeatherData = async (cityName) => {
    setCity(cityName);
    try {
      setLoading(true);
      setError(null);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`,
      );
      const forecastData = await forecastResponse.json();

      const dailyForecast = forecastData.list.filter(
        (item, index) => index % 8 === 0,
      );
      setForecast(dailyForecast);
    } catch (err) {
      setError("Couldn't fetch data, try again");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  function handlerSearch(e) {
    e.preventDefault();
    fetchWeatherData(searchInput);
  }

  if (loading) return <div className="wrapper">Loading...</div>;
  return (
    <div className="wrapper">
      <form onSubmit={handlerSearch} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter city name"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      {error && <p className="error">{error}</p>}

      {weatherData && weatherData.main && weatherData.weather && (
        <>
          <div className="header">
            <h1 className="city">{weatherData.name}</h1>
            <p className="temperature">{weatherData.main.temp}° C</p>
            <p className="condition">{weatherData.weather[0].main}</p>
          </div>
          <div className="weather-details">
            <div>
              <p>Humidity</p>
              <p style={{ fontWeight: "bold" }}>
                {Math.round(weatherData.main.humidity)}%
              </p>
            </div>
            <div>
              <p>Wind Speed</p>
              <p style={{ fontWeight: "bold" }}>
                {Math.round(weatherData.wind.speed)} kph
              </p>
            </div>
          </div>
        </>
      )}
      {forecast.length > 0 && (
        <>
          <div className="forecast">
            <h2 className="forecast-header">5 - Day Forcast</h2>
            <div className="forecast-days">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                  />
                  <p>{Math.round(day.main.temp)} °C</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
