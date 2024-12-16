import React, { useEffect, useRef, useState } from "react";
import "./Wheather.css";
import search_icon from "../assets/search.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import clear from "../assets/clear.jpeg";
import cloud from "../assets/cloud.jpeg";
import drizzle from "../assets/dri.jpg";
import rain from "../assets/rain.jpeg";
import snow from "../assets/snow.jpg";

import thunderSound from "../assets/thunder.mp3";
import cloudySound from "../assets/cloudy.mp3";
import drizzleSound from "../assets/drizzley.mp3";
import sunnySound from "../assets/sunny.mp3";

const Wheather = () => {
  const inputref = useRef();
  const [weatherData, setWeatherData] = useState({
    humidity: null,
    windSpeed: null,
    temperature: null,
    location: "",
    icon: "",
    background: clear,
    audio: null,
  });
  const [city, setCity] = useState("");
  const [audioInstance, setAudioInstance] = useState(null);

  const allIcon = {
    "01d": cloud_icon,
    "01n": cloud_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const frontIcon = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  // Weather sound mapping
  const weatherSounds = {
    "01d": sunnySound,
    "01n": sunnySound,
    "02d": cloudySound,
    "02n": cloudySound,
    "03d": cloudySound,
    "03n": cloudySound,
    "04d": drizzleSound,
    "04n": drizzleSound,
    "09d": drizzleSound,
    "09n": drizzleSound,
    "10d": drizzleSound,
    "10n": drizzleSound,
    "13d": thunderSound,
    "13n": thunderSound,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter city Name");
      return;
    }
    try {
      const API = import.meta.env.VITE_API;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API}`;


      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcon[data.weather[0].icon] || cloud_icon;
      const background = frontIcon[data.weather[0].icon] || clear;
      const sound = weatherSounds[data.weather[0].icon] || sunnySound;

      // Stop any currently playing audio before starting a new one
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0; // Reset audio time
      }

      const newAudioInstance = new Audio(sound);
      newAudioInstance.play();

      // Stop the audio after 10 seconds
      setTimeout(() => {
        newAudioInstance.pause();
        newAudioInstance.currentTime = 0;
      }, 10000); // 10 seconds

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: data.main.temp,
        location: data.name,
        icon: icon,
        background: background,
        audio: sound,
      });

      // Save the new audio instance
      setAudioInstance(newAudioInstance);

    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    search("munnar"); // Default city when component mounts
  }, []);

  const handleSearch = () => {
    if (city.trim() !== "") {
      search(city);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search(inputref.current.value);
    }
  };

  return (
    <div
      className="weather"
      style={{
        backgroundImage: `url(${weatherData.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="search">
        <input
          ref={inputref}
          type="text"
          placeholder="Search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(inputref.current.value)}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="weather-info">
        <img
          src={weatherData.icon}
          alt="Weather Icon"
          className="weather-icon"
        />
        <p className="temperature">
          {weatherData.temperature ? `${weatherData.temperature} °C` : "Loading..."}
        </p>
        <p className="location">{weatherData.location || "Loading..."}</p>
        <div className="weather-data">
          <div className="col">
            <img src={humidity_icon} alt="Humidity" />
            <div>
              <p>{weatherData.humidity ? `${weatherData.humidity} %` : "-"}</p>
              <span>Humidity</span>
            </div>
          </div>
          <div className="col">
            <img src={wind_icon} alt="Wind Speed" />
            <div>
              <p>{weatherData.windSpeed ? `${weatherData.windSpeed} m/s` : "-"}</p>
              <span>Wind Speed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wheather;
