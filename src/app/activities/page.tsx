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

  useEffect(() => {
    if (city && city !== "Unknown Location") {
      fetchForecast(city)
        .then((data) => {
          setWeatherData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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

  if (error) {
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
            const isToday = index === 0;

            return (
              <div
                key={day.date}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isToday ? "ring-2 ring-cyan-500" : ""
                }`}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-xl">
                      {isToday
                        ? "Today"
                        : new Date(day.date).toLocaleDateString("en-US", {
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

                {/* Weather Icon & Condition */}
                <div className="p-6 text-center">
                  <img
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                    className="w-16 h-16 mx-auto mb-3"
                  />
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    {day.day.condition.text}
                  </h4>

                  {/* Temperature */}
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

                  {/* Rain Chance */}
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

                  {/* Outfit Suggestion */}
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

      {/* Activity Suggestions Footer */}
      <div className="mt-12 text-center">
        <div className="bg-white rounded-xl p-6 shadow-lg inline-block">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            🎯 Activity Planning
          </h3>
          <p className="text-gray-500">
            Use this forecast to plan your perfect day in{" "}
            {weatherData?.location.name || city}!
          </p>
        </div>
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
