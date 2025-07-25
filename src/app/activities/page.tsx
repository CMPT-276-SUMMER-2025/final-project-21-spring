"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface WeatherDay {
  date: string;
  day: {
    condition: {
      text: string;
      icon: string;
    };
    avgtemp_c: number;
    maxtemp_c: number;
    mintemp_c: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
  };
}

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  forecast: {
    forecastday: WeatherDay[];
  };
}

interface GeoFeature {
  properties: {
    lat: number;
    lon: number;
    formatted: string;
  };
}

interface GeoData {
  features: GeoFeature[];
}

const outfitSuggestions: Record<string, string> = {
  // Sunny conditions
  Sunny: "🕶️ Sunglasses and light clothes",
  Clear: "🕶️ Sunglasses and light clothes",

  // Partly cloudy conditions
  "Partly cloudy": "🧢 Light jacket just in case",
  "Partly Cloudy": "� Light jacket just in case",

  // Cloudy conditions
  Cloudy: "�🧥 A sweater or hoodie",
  Overcast: "🧥 Jacket recommended",

  // Rain conditions
  Rain: "🌧️ Umbrella and waterproof shoes",
  "Light rain": "🌂 Umbrella recommended",
  "Moderate rain": "🌧️ Umbrella and waterproof shoes",
  "Heavy rain": "🧥 Raincoat and boots",
  "Patchy rain possible": "🌂 Umbrella recommended",
  "Patchy light rain": "🌂 Umbrella recommended",
  "Light rain shower": "🌂 Umbrella recommended",
  "Moderate or heavy rain shower": "🧥 Raincoat and boots",
  "Torrential rain shower": "🧥 Raincoat and boots",

  // Storm conditions
  Thunderstorm: "⚡ Stay indoors, bring a raincoat",
  "Thundery outbreaks possible": "⚡ Stay indoors, bring a raincoat",
  "Patchy light rain with thunder": "⚡ Stay indoors, bring a raincoat",
  "Moderate or heavy rain with thunder": "⚡ Stay indoors, bring a raincoat",

  // Snow conditions
  Snow: "🧤 Winter coat, gloves, and boots",
  "Light snow": "🧤 Winter coat, gloves, and boots",
  "Moderate snow": "🧤 Winter coat, gloves, and boots",
  "Heavy snow": "🧤 Winter coat, gloves, and boots",
  "Patchy light snow": "🧤 Winter coat, gloves, and boots",
  "Light snow showers": "🧤 Winter coat, gloves, and boots",
  "Moderate or heavy snow showers": "🧤 Winter coat, gloves, and boots",
  "Blowing snow": "🧤 Winter coat, gloves, and boots",
  Blizzard: "🧤 Winter coat, gloves, and boots",

  // Mist/Fog conditions
  Mist: "🌫️ Wear bright clothes for visibility",
  Fog: "🌫️ Wear bright clothes for visibility",
  "Freezing fog": "🌫️ Wear bright clothes for visibility",

  // Drizzle conditions
  "Patchy light drizzle": "🌂 Light umbrella recommended",
  "Light drizzle": "🌂 Light umbrella recommended",
  "Freezing drizzle": "🧥 Waterproof jacket recommended",
  "Heavy freezing drizzle": "🧥 Waterproof jacket and boots",

  // Sleet conditions
  "Patchy sleet possible": "🧥 Waterproof jacket recommended",
  "Light sleet": "🧥 Waterproof jacket and boots",
  "Moderate or heavy sleet": "🧥 Waterproof jacket and boots",
  "Light sleet showers": "🧥 Waterproof jacket and boots",
  "Moderate or heavy sleet showers": "🧥 Waterproof jacket and boots",

  // Ice conditions
  "Ice pellets": "🧤 Winter coat and non-slip shoes",
  "Light showers of ice pellets": "🧤 Winter coat and non-slip shoes",
  "Moderate or heavy showers of ice pellets":
    "🧤 Winter coat and non-slip shoes",
};

function getOutfitSuggestion(condition: string): string {
  // Debug: log the condition to see what we're getting
  console.log("Weather condition:", condition);

  // Try exact match first
  if (outfitSuggestions[condition]) {
    return outfitSuggestions[condition];
  }

  // Try case-insensitive match
  const lowerCondition = condition.toLowerCase();
  for (const [key, suggestion] of Object.entries(outfitSuggestions)) {
    if (key.toLowerCase() === lowerCondition) {
      return suggestion;
    }
  }

  // Try partial matches for common patterns
  if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) {
    return "🕶️ Sunglasses and light clothes";
  }
  if (lowerCondition.includes("rain")) {
    return "🌧️ Umbrella and waterproof shoes";
  }
  if (lowerCondition.includes("snow")) {
    return "🧤 Winter coat, gloves, and boots";
  }
  if (lowerCondition.includes("cloud")) {
    return "🧢 Light jacket just in case";
  }
  if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) {
    return "⚡ Stay indoors, bring a raincoat";
  }
  if (lowerCondition.includes("fog") || lowerCondition.includes("mist")) {
    return "🌫️ Wear bright clothes for visibility";
  }

  // Fallback with the actual condition shown
  return `🧳 Check the forecast before leaving! (${condition})`;
}

async function fetchForecast(city: string): Promise<WeatherData> {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_WEATHER_BASE_URL;

  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}&days=3`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch forecast");
  }

  return response.json();
}

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "Unknown Location";
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [w, g] = await Promise.all([fetchWeather(city), fetchGeo(city)]);
        setWeatherData(w);
        setGeoData(g);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (city !== "Unknown Location") loadAll();
    else setLoading(false);
  }, [city]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading weather forecast...</p>
        </div>
      </div>
    );
  }

  if (error|| !weatherData || !geoData || geoData.features.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-bold text-6xl mb-4">Activities in {city}</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 text-lg">❌ Error: {error}</p>
          <p className="text-red-500 mt-2">
            Please try searching for a different city.
          </p>
        </div>
      </div>
    );
  }

  const { lat, lon, formatted } = geoData.features[0].properties;
  const mapSrc = `https://api.geoapify.com/v1/staticmap?center=lonlat:${lon},${lat}&zoom=12&size=600x300&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`;

  const activities: Activity[] = [
    { name: 'City Museum', location: city, category: 'Tourism', emoji: '🏛️' },
    { name: 'Central Park Concert', location: city, category: 'Entertainment', emoji: '🎵' },
    { name: 'Food Market', location: city, category: 'Culinary', emoji: '🍽️' },
    { name: 'Historic Walking Tour', location: city, category: 'Tourism', emoji: '🚶‍♂️' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-bold text-6xl mb-4">
          Weather Forecast for {weatherData?.location.name || city}
        </h1>
        <p className="text-xl text-gray-600">
          {weatherData?.location.region &&
            weatherData?.location.country &&
            `${weatherData.location.region}, ${weatherData.location.country}`}
        </p>
        <p className="text-lg text-gray-500 mt-2">
          Plan your activities based on the 3-day weather forecast
        </p>
      </div>

      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {weatherData.forecast.forecastday.map((day, index) => {
            const suggestion = getOutfitSuggestion(day.day.condition.text);
            const todayStr = new Date().toLocaleDateString("en-CA"); // e.g. "2025-07-25"
            const isToday = day.date === todayStr;

            return (
              <div
                key={day.date}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isToday ? "ring-2 ring-cyan-500" : ""
                }`}
              >
               
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-xl">
                          {index === 0
                            ? "Today"
                            : index === 1
                            ? "Tomorrow"
                            : new Date(day.date + "T12:00:00").toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}

                    </h3>
                    {isToday && (
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        NOW
                      </span>
                    )}
                  </div>
                  <p className="text-cyan-100 text-sm">{day.date}</p>
                </div>

                <div className="p-6 text-center">
                  <img
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                    className="w-16 h-16 mx-auto mb-3"
                  />
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    {day.day.condition.text}
                  </h4>

                 
                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-blue-600 font-semibold">Avg</p>
                      <p className="text-lg font-bold text-blue-800">
                        {day.day.avgtemp_c}°C
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <p className="text-red-600 font-semibold">High</p>
                      <p className="text-lg font-bold text-red-800">
                        {day.day.maxtemp_c}°C
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-gray-600 font-semibold">Low</p>
                      <p className="text-lg font-bold text-gray-800">
                        {day.day.mintemp_c}°C
                      </p>
                    </div>
                  </div>

                 
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-blue-600 font-semibold text-sm">
                      Rain Chance
                    </p>
                    <p className="text-xl font-bold text-blue-800">
                      {day.day.daily_chance_of_rain ||
                        day.day.daily_will_it_rain}
                      %
                    </p>
                  </div>

                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 font-semibold text-sm mb-1">
                      Outfit Suggestion
                    </p>
                    <p className="text-yellow-700 text-sm">{suggestion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activities */}
 <div className="max-w-6xl mx-auto mt-15 mb-15">
        <h2 className="text-3xl font-bold mb-6">Activities in {weatherData.location.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(act => (
            <div key={act.name} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-2">{act.emoji} {act.name}</h3>
                <p className="text-gray-600 mb-4">{act.location}</p>
                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">{act.emoji} {act.category}</span>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg">View Details</button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg">Location</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="text-center">
        <img src={mapSrc} alt={`Map of ${weatherData.location.name}`} className="mx-auto rounded-lg mb-4 shadow" />
        <p className="text-gray-600">{formatted} ({lat.toFixed(4)}, {lon.toFixed(4)})</p>
      </div>
    </div>
  );
}

export default function Activities() {
  return (
    <Suspense
      fallback={<div className="text-center py-8">Loading activities...</div>}
    >
      <ActivitiesContent />
    </Suspense>
  );
}

interface GeoFeature {
  properties: { lat: number; lon: number; formatted: string };
}

interface GeoData {
  features: GeoFeature[];
}

// Activity Interface
interface Activity {
  name: string;
  location: string;
  category: string;
  emoji: string;
}

// Fetch weather
async function fetchWeather(city: string): Promise<WeatherData> {
  const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY!;
  const base = process.env.NEXT_PUBLIC_WEATHER_BASE_URL!;
  const res = await fetch(`${base}/forecast.json?key=${key}&q=${encodeURIComponent(city)}&days=3`);
  if (!res.ok) throw new Error('Weather fetch failed');
  return res.json();
}

// Fetch geocode
async function fetchGeo(city: string): Promise<GeoData> {
  const key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY!;
  const base = process.env.NEXT_PUBLIC_GEOAPIFY_BASE_URL!;
  const res = await fetch(`${base}/geocode/search?text=${encodeURIComponent(city)}&apiKey=${key}`);
  if (!res.ok) throw new Error('Geocode fetch failed');
  return res.json();
}