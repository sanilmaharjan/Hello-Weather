import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, Loader2, AlertTriangle, RefreshCcw, MapPin } from 'lucide-react';
import cloudImg from '../assets/images/cloud.png';

const WeatherDashboard = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // no default here

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  const getWeatherIcon = (main) => {
    switch (main?.toLowerCase()) {
      case 'clear': return <Sun className="text-[#8CC2FF] w-8 h-8 mb-4 hover:rotate-45 transition-transform duration-500" strokeWidth={1.5} />;
      case 'clouds': return <Cloud className="text-gray-400 w-8 h-8 mb-4 hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />;
      case 'rain':
      case 'drizzle': return <CloudRain className="text-blue-500 w-8 h-8 mb-4 hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />;
      case 'snow': return <Snowflake className="text-blue-200 w-8 h-8 mb-4 hover:rotate-90 transition-transform duration-500" strokeWidth={1.5} />;
      case 'thunderstorm': return <CloudLightning className="text-yellow-500 w-8 h-8 mb-4 hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />;
      default: return <Sun className="text-[#8CC2FF] w-8 h-8 mb-4 hover:rotate-45 transition-transform duration-500" strokeWidth={1.5} />;
    }
  };

  const fetchWeather = async (qParam, lat, lon) => {
    setLoading(true);
    setError(null);
    let targetLat = lat;
    let targetLon = lon;
    let locationName = qParam;
    let locationCountry = "";

    try {
      // 1. Resolve Coordinates and Location Info
      if (!lat || !lon) {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${qParam}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        if (!geoData.results?.length) throw new Error('We encountered a disturbance in the data stream. City may not exist.');
        targetLat = geoData.results[0].latitude;
        targetLon = geoData.results[0].longitude;
        locationName = geoData.results[0].name;
        locationCountry = geoData.results[0].country || "";
      } else if (!locationName) {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLat}&lon=${targetLon}`);
        const geoData = await geoRes.json();
        locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state || "Unknown location";
        locationCountry = geoData.address?.country || "";
      }

      // 2. Fetch primary weather data from Open-Meteo
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to synchronize celestial data.');
      const data = await res.json();

      // Convert WMO standard codes to UI descriptors
      const getDesc = (code) => {
        if (code <= 3) return 'Clear';
        if (code <= 48) return 'Clouds';
        if (code <= 67) return 'Rain';
        if (code <= 77) return 'Snow';
        if (code <= 82) return 'Rain';
        if (code <= 86) return 'Snow';
        if (code <= 99) return 'Thunderstorm';
        return 'Clear';
      };

      setWeatherData({
        city: locationName,
        country: locationCountry, 
        desc: getDesc(data.current.weather_code),
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        wind: Math.round(data.current.wind_speed_10m),
        humidity: Math.round(data.current.relative_humidity_2m),
      });

      const daily = [];
      for (let i = 1; i <= 5; i++) { 
        daily.push({
          date: new Date(data.daily.time[i]).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          iconType: getDesc(data.daily.weather_code[i])
        });
      }
      setForecastData(daily);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    initFetch();
  };

  const initFetch = () => {
    setLoading(true);
    setError(null);
    if (query) {
      fetchWeather(query);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchWeather(null, pos.coords.latitude, pos.coords.longitude),
          () => {
            setLoading(false);
            setError("Location access denied. Please search for a city using the bar above.");
          }
        );
      } else {
        setLoading(false);
        setError("Geolocation is not supported by your browser. Please search for a city above.");
      }
    }
  };

  useEffect(() => {
    initFetch();
  }, [query]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <Loader2 className="w-16 h-16 text-[#4A90E2] animate-spin mb-6" strokeWidth={2.5} />
        <h4 className="text-[#647C96] text-xl font-medium mb-2">Synchronizing Celestial Data</h4>
        <p className="text-[#78889B] font-medium">Fetching the latest atmospheric readings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="w-full max-w-lg bg-[#E54545] rounded-xl p-8 shadow-inner shadow-black/10">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-white/80 w-8 h-8" strokeWidth={2} />
            <span className="text-xl font-bold text-white/90">Telemetry Interrupted</span>
          </div>
          <p className="text-white/90 text-sm leading-relaxed mb-8">
            {error}
          </p>
          <button 
            onClick={handleRetry}
            className="bg-white/30 hover:bg-white/40 transition-colors text-white font-medium text-sm px-6 py-2 rounded-md flex items-center gap-2 pointer-events-none opacity-50 hidden"
          >
            {/* Hidden retry button when error is handled manually */}
            <RefreshCcw className="w-4 h-4" />
            Attempt Reconnection
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-8 max-w-6xl mx-auto space-y-12 pb-24"
    >
      <motion.div variants={itemVariants} className="w-full bg-white rounded-xl border border-[#4A90E2] flex flex-col md:flex-row overflow-hidden relative">
        <div className="p-8 md:w-1/2 flex flex-col justify-start z-10">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="text-[#4A90E2] w-6 h-6" strokeWidth={2.5} />
            <h2 className="text-3xl font-extrabold text-[#78889B]">{weatherData?.city}</h2>
          </div>
          <p className="text-xs font-bold text-[#78889B] tracking-wider uppercase ml-8 mb-10">
            {weatherData?.country} - {weatherData?.desc}
          </p>
          <div className="text-[120px] font-extrabold text-[#2A3746] leading-none ml-2 tracking-tighter">
            {weatherData?.temp}° C
          </div>
        </div>
        
        <div className="md:w-1/2 relative min-h-[250px] p-8 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-no-repeat pointer-events-none opacity-[0.85]"
            style={{ 
              backgroundImage: `url(${cloudImg})`, 
              backgroundSize: '140%', 
              backgroundPosition: 'right 40%' 
            }}
          />

          <div className="relative z-10 grid grid-cols-2 gap-y-12 gap-x-16 text-center w-full max-w-sm">
            <div>
              <p className="text-sm font-bold text-black tracking-wider mb-1">FEELS LIKE</p>
              <p className="text-3xl font-extrabold text-black">{weatherData?.feelsLike}° C</p>
            </div>
            <div>
              <p className="text-sm font-bold text-black tracking-wider mb-1">WIND</p>
              <p className="text-3xl font-extrabold text-black">{weatherData?.wind} km/h</p>
            </div>
            <div>
              <p className="text-sm font-bold text-black tracking-wider mb-1">HUMIDITY</p>
              <p className="text-3xl font-extrabold text-black">{weatherData?.humidity}%</p>
            </div>
            <div>
              <p className="text-sm font-bold text-black tracking-wider mb-1">UV INDEX</p>
              <p className="text-3xl font-extrabold text-black">NOT AVAIL.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        <h3 className="text-2xl font-extrabold text-[#78889B] tracking-wide mb-8">
          5 - DAY FORECAST
        </h3>
        
        <div className="flex flex-row overflow-x-auto gap-4 justify-between w-full max-w-4xl px-4 md:px-0">
          {forecastData.map((item, index) => (
            <div key={index} className="flex flex-col items-center min-w-[60px]">
              <span className="text-lg font-extrabold text-black mb-4">{item.date}</span>
              {getWeatherIcon(item.iconType)}
              <span className="text-[#78889B] text-lg font-medium">{item.tempMax}°</span>
              <span className="text-[#78889B] text-sm">{item.tempMin}°</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherDashboard;
