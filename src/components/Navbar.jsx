import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Navbar = () => {
  const [userLocation, setUserLocation] = useState(() => 
    navigator.geolocation ? "Fetching location..." : "Geolocation unsupported"
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || "Unknown location";
          setUserLocation(city);
        } catch {
          setUserLocation("Location available");
        }
      },
      () => setUserLocation("Location access denied")
    );
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=5&language=en&format=json`);
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCities();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    navigate(`/dashboard?q=${encodeURIComponent(city.name)}`);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsDropdownOpen(false);
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-white border-b-2 border-black max-w-full relative z-20">
      <Link to="/" className="text-2xl font-extrabold text-[#2A3746] tracking-tight">
        Hello Weather
      </Link>
      <div className="flex items-center gap-6">
        <Link 
          to="/" 
          className={`text-xl font-bold transition-colors ${pathname === '/' ? 'text-[#8898AA]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Home
        </Link>
        
        {pathname === '/' ? (
          <Link 
            to="/dashboard" 
            className="text-xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Dashboard
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => { if (suggestions.length > 0) setIsDropdownOpen(true); }}
              onKeyDown={handleSearch}
              placeholder="Search city..." 
              className="pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-400 w-64 text-sm font-medium text-gray-700"
            />
            
            {isDropdownOpen && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col py-1">
                {suggestions.map((city) => (
                  <button 
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-left focus:outline-none"
                  >
                    <div className="font-semibold text-gray-800">{city.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="relative group flex items-center cursor-pointer ml-2">
          <MapPin className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors" strokeWidth={2} />
          <div className="absolute right-0 top-full mt-2 w-max px-3 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {userLocation}
            <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
