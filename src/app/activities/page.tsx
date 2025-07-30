"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ActivityCard, { Activity } from "../components/ActivityCard";

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

const CATEGORY_EMOJIS: Record<string, string> = {
  tourism: "🏛️",
  "tourism.attraction": "🎢",
  "tourism.museum": "🖼️",
  "tourism.monument": "⛲",
  "tourism.viewpoint": "🌅",
  "tourism.zoo": "🦁",
  entertainment: "🎵",
  "entertainment.nightclub": "🕺",
  "entertainment.cinema": "🎬",
  "entertainment.theatre": "🎭",
  "entertainment.casino": "🎰",
  "entertainment.bowling": "🎳",
  food_culinary: "🍽️",
  leisure: "🎡",
  "leisure.park": "🌳",
  "leisure.beach": "🏖️",
  "leisure.sports": "⚽",
  "leisure.fitness": "💪",
  "leisure.spa": "🧘",
  "leisure.golf": "⛳",
  catering: "🍽️",
  "catering.restaurant": "🍽️",
  "catering.fast_food": "🍔",
  "catering.pizza": "🍕",
  "catering.cafe": "☕",
  "catering.bar": "🍸",
  "catering.pub": "🍺",
  "catering.ice_cream": "🍦",
  "catering.bakery": "🥐",
  "catering.food_court": "🥘",
  shopping: "🛍️",
  "shopping.mall": "🏬",
  "shopping.supermarket": "🛒",
  "shopping.clothes": "👕",
  "shopping.books": "📚",
  accommodation: "🏨",
  "accommodation.hotel": "🏨",
  "accommodation.hostel": "🏠",
  "accommodation.camping": "⛺",
  transport: "🚌",
  "transport.bus": "🚌",
  "transport.train": "🚊",
  "transport.taxi": "🚕",
  healthcare: "🏥",
  education: "🎓",
  religion: "⛪",
  nature: "🌲",
  sport: "🏃",
  culture: "🎨",
  history: "📜",
};

const CATEGORY_NAMES: Record<string, string> = {
  tourism: "Tourism",
  "tourism.attraction": "Attraction",
  "tourism.museum": "Museum",
  "tourism.monument": "Monument",
  "tourism.viewpoint": "Viewpoint",
  "tourism.zoo": "Zoo",
  entertainment: "Entertainment",
  "entertainment.nightclub": "Nightclub",
  "entertainment.cinema": "Cinema",
  "entertainment.theatre": "Theatre",
  "entertainment.casino": "Casino",
  "entertainment.bowling": "Bowling",
  leisure: "Leisure",
  "leisure.park": "Park",
  "leisure.beach": "Beach",
  "leisure.sports": "Sports",
  "leisure.fitness": "Fitness",
  "leisure.spa": "Spa",
  "leisure.golf": "Golf",
  "catering.restaurant": "Restaurant",
  "catering.fast_food": "Fast Food",
  "catering.pizza": "Pizza",
  "catering.cafe": "Cafe",
  "catering.bar": "Bar",
  "catering.pub": "Pub",
  "catering.ice_cream": "Ice Cream",
  "catering.bakery": "Bakery",
  "catering.food_court": "Food Court",
  shopping: "Shopping",
  "shopping.mall": "Mall",
  "shopping.supermarket": "Supermarket",
  "shopping.clothes": "Clothing",
  "shopping.books": "Bookstore",
  accommodation: "Hotel",
  "accommodation.hotel": "Hotel",
  "accommodation.hostel": "Hostel",
  "accommodation.camping": "Camping",
  transport: "Transport",
  healthcare: "Healthcare",
  education: "Education",
  religion: "Religious Site",
  nature: "Nature",
  sport: "Sports",
  culture: "Culture",
  history: "History",
};

const ACTIVITY_TAGS: Record<string, string[]> = {
  tourism: ["Sightseeing", "Culture", "History", "Photography"],
  "tourism.attraction": ["Fun", "Family Friendly", "Adventure", "Photography"],
  "tourism.museum": ["Culture", "Education", "History", "Art"],
  "tourism.monument": ["History", "Culture", "Photography", "Architecture"],
  "tourism.viewpoint": ["Scenic", "Photography", "Nature", "Romantic"],
  "tourism.zoo": ["Family Friendly", "Animals", "Education", "Fun"],
  entertainment: ["Music", "Shows", "Fun", "Nightlife"],
  "entertainment.nightclub": ["Dancing", "Music", "Nightlife", "Social"],
  "entertainment.cinema": ["Movies", "Entertainment", "Indoor", "Date Night"],
  "entertainment.theatre": ["Shows", "Culture", "Performance", "Art"],
  "entertainment.casino": ["Gaming", "Entertainment", "Nightlife", "Adult"],
  "entertainment.bowling": ["Sports", "Family Friendly", "Fun", "Social"],
  leisure: ["Recreation", "Relaxing", "Fun"],
  "leisure.park": ["Nature", "Walking", "Family Friendly", "Outdoor"],
  "leisure.beach": ["Swimming", "Sun", "Relaxing", "Water Sports"],
  "leisure.sports": ["Active", "Fitness", "Competition", "Outdoor"],
  "leisure.fitness": ["Exercise", "Health", "Wellness", "Indoor"],
  "leisure.spa": ["Relaxing", "Wellness", "Luxury", "Self Care"],
  "leisure.golf": ["Sports", "Outdoor", "Precision", "Social"],
  "catering.restaurant": ["Dining", "Food", "Cuisine"],
  "catering.fast_food": ["Quick", "Casual", "Affordable", "Convenient"],
  "catering.pizza": ["Italian", "Casual", "Family Friendly", "Delivery"],
  "catering.cafe": ["Coffee", "Casual", "Relaxing", "WiFi"],
  "catering.bar": ["Drinks", "Social", "Nightlife", "Adult"],
  "catering.pub": ["Beer", "Social", "Casual", "Traditional"],
  "catering.ice_cream": ["Sweet", "Family Friendly", "Dessert", "Cool"],
  "catering.bakery": ["Fresh", "Breakfast", "Sweet", "Local"],
  "catering.food_court": ["Variety", "Quick", "Casual", "Choice"],
  shopping: ["Shopping", "Retail", "Browse"],
  "shopping.mall": ["Shopping", "Indoor", "Variety", "All Weather"],
  "shopping.clothes": ["Fashion", "Style", "Trendy", "Personal"],
  "shopping.books": ["Reading", "Knowledge", "Quiet", "Educational"],
  accommodation: ["Stay", "Rest", "Travel"],
  nature: ["Outdoor", "Fresh Air", "Scenic", "Peaceful"],
  sport: ["Active", "Competition", "Fitness", "Team"],
  culture: ["Art", "History", "Learning", "Heritage"],
  history: ["Past", "Educational", "Heritage", "Stories"],
};

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "Unknown Location";
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [w, g] = await Promise.all([fetchWeather(city), fetchGeo(city)]);
        setWeatherData(w);
        setGeoData(g);
        const { lat, lon } = g.features[0].properties;
        setWeatherData(w);
        setGeoData(g);

        const places = await fetchPlaces(lat, lon, city);
        setActivities(places);
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

  if (error || !weatherData || !geoData || geoData.features.length === 0) {
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

  // Filter activities based on selected tag
  const filteredActivities = selectedTag
    ? activities.filter((activity) => activity.tags.includes(selectedTag))
    : activities;

  // Get all unique tags from activities
  const allTags = [...new Set(activities.flatMap((activity) => activity.tags))];

  return (
    <div className="min-h-screen">
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
                          : new Date(day.date + "T12:00:00").toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              }
                            )}
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

        {/* Activities Section */}
        <div className="max-w-6xl mx-auto mt-15 mb-15">
          <h2 className="text-3xl font-bold mb-6">
            Activities in {weatherData?.location.name}
          </h2>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Filter by tags:</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTag === null
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Activities
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTag === tag
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                selectedTag={selectedTag}
                onTagClick={setSelectedTag}
              />
            ))}
          </div>

          {filteredActivities.length === 0 && activities.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No activities found with the selected tag.
              </p>
            </div>
          )}
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

interface GeoFeature {
  properties: { lat: number; lon: number; formatted: string };
}

interface GeoData {
  features: GeoFeature[];
}

async function fetchWeather(city: string): Promise<WeatherData> {
  const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY!;
  const base = process.env.NEXT_PUBLIC_WEATHER_BASE_URL!;
  const res = await fetch(
    `${base}/forecast.json?key=${key}&q=${encodeURIComponent(city)}&days=3`
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}

async function fetchGeo(city: string): Promise<GeoData> {
  const key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY!;
  const base = process.env.NEXT_PUBLIC_GEOAPIFY_BASE_URL!;
  const res = await fetch(
    `${base}/geocode/search?text=${encodeURIComponent(city)}&apiKey=${key}`
  );
  if (!res.ok) throw new Error("Geocode fetch failed");
  return res.json();
}

// Function to generate realistic descriptions based on place type and name
function generateDescription(
  placeName: string,
  category: string,
  city: string
): string {
  const name = placeName.toLowerCase();
  const categoryLower = category.toLowerCase();

  // Specific descriptions based on category
  if (categoryLower.includes("restaurant")) {
    const cuisineTypes = [
      "delicious local cuisine",
      "fresh seasonal ingredients",
      "authentic flavors",
      "signature dishes",
    ];
    const randomCuisine =
      cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)];
    return `Experience ${randomCuisine} at this popular dining destination in ${city}. Known for excellent service and a welcoming atmosphere.`;
  }

  if (categoryLower.includes("cafe")) {
    const cafeFeatures = [
      "artisanal coffee",
      "fresh pastries",
      "cozy atmosphere",
      "local favorite",
    ];
    const randomFeature =
      cafeFeatures[Math.floor(Math.random() * cafeFeatures.length)];
    return `A charming cafe featuring ${randomFeature}. Perfect for a relaxing break while exploring ${city}.`;
  }

  if (categoryLower.includes("bar") || categoryLower.includes("pub")) {
    const barFeatures = [
      "craft cocktails",
      "local brews",
      "live entertainment",
      "social atmosphere",
    ];
    const randomFeature =
      barFeatures[Math.floor(Math.random() * barFeatures.length)];
    return `Unwind with ${randomFeature} at this popular local spot. A great place to socialize and experience ${city}'s nightlife.`;
  }

  if (categoryLower.includes("museum")) {
    return `Discover fascinating exhibits and cultural treasures at this renowned museum in ${city}. Educational and inspiring for visitors of all ages.`;
  }

  if (categoryLower.includes("park")) {
    const parkFeatures = [
      "scenic walking trails",
      "beautiful gardens",
      "recreational facilities",
      "peaceful natural setting",
    ];
    const randomFeature =
      parkFeatures[Math.floor(Math.random() * parkFeatures.length)];
    return `Enjoy ${randomFeature} at this lovely green space in ${city}. Perfect for outdoor activities and connecting with nature.`;
  }

  if (
    categoryLower.includes("theatre") ||
    categoryLower.includes("theater") ||
    categoryLower.includes("cinema")
  ) {
    return `Experience world-class entertainment at this premier venue in ${city}. Check their schedule for upcoming shows and events.`;
  }

  if (
    categoryLower.includes("hotel") ||
    categoryLower.includes("accommodation")
  ) {
    return `Comfortable accommodations with excellent amenities in the heart of ${city}. Ideal for travelers seeking quality and convenience.`;
  }

  if (categoryLower.includes("shopping") || categoryLower.includes("mall")) {
    return `Browse unique shops and discover local treasures at this popular shopping destination in ${city}. Something for everyone to enjoy.`;
  }

  if (
    categoryLower.includes("attraction") ||
    categoryLower.includes("tourism")
  ) {
    const attractions = [
      "breathtaking views and memorable experiences",
      "rich history and cultural significance",
      "stunning architecture and unique features",
      "photo-worthy moments and lasting memories",
    ];
    const randomAttraction =
      attractions[Math.floor(Math.random() * attractions.length)];
    return `Discover ${randomAttraction} at this must-visit destination in ${city}. A highlight of any trip to the area.`;
  }

  if (categoryLower.includes("spa") || categoryLower.includes("wellness")) {
    return `Rejuvenate your mind and body at this tranquil wellness sanctuary in ${city}. Professional treatments in a peaceful setting.`;
  }

  if (categoryLower.includes("sports") || categoryLower.includes("fitness")) {
    return `Stay active and energized at this well-equipped facility in ${city}. Great for fitness enthusiasts and casual visitors alike.`;
  }

  // Enhanced fallback descriptions based on place name patterns
  if (name.includes("center") || name.includes("centre")) {
    return `A vibrant community hub offering various services and activities in ${city}. A focal point for local gatherings and events.`;
  }

  if (name.includes("plaza") || name.includes("square")) {
    return `A bustling public space in the heart of ${city}. Great for people-watching, events, and soaking in the local atmosphere.`;
  }

  if (name.includes("gallery")) {
    return `Explore inspiring art collections and creative works at this cultural venue in ${city}. A feast for art lovers and curious minds.`;
  }

  if (name.includes("market")) {
    return `Experience local flavors and artisan goods at this vibrant marketplace in ${city}. Perfect for discovering unique finds and local culture.`;
  }

  // General fallback with more variety
  const generalDescriptions = [
    `A notable destination in ${city} worth visiting during your stay. Discover what makes this place special to locals and visitors alike.`,
    `An interesting spot that adds character to ${city}'s diverse landscape. Perfect for those looking to explore beyond the typical tourist path.`,
    `A local gem in ${city} that offers a unique glimpse into the area's culture and community. Well worth a visit during your time here.`,
    `Experience authentic ${city} charm at this well-regarded local establishment. A favorite among both residents and travelers.`,
  ];

  return generalDescriptions[
    Math.floor(Math.random() * generalDescriptions.length)
  ];
}

// Update the fetchPlaces function to return Activity objects with all required fields
async function fetchPlaces(
  lat: number,
  lon: number,
  city: string
): Promise<Activity[]> {
  const key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY!;
  const base = "https://api.geoapify.com/v2/places";
  const categories = [
    "tourism",
    "entertainment",
    "catering.restaurant",
    "catering.cafe",
    "catering.bar",
  ].join(",");

  const bbox = `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`;

  const url =
    `${base}?categories=${categories}` +
    `&filter=rect:${bbox}` +
    `&limit=12&apiKey=${key}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("Places fetch failed status:", res.status, await res.text());
    throw new Error("Places fetch failed");
  }

  const json = await res.json();
  return json.features.map((f: any, index: number) => {
    const catSlug = f.properties.categories?.[0]?.slug || "tourism";

    // Debug logging to see what categories we're getting
    console.log(
      "Place:",
      f.properties.name,
      "Category:",
      catSlug,
      "All categories:",
      f.properties.categories
    );

    // Try to get a more specific emoji based on place name or type
    let emoji = CATEGORY_EMOJIS[catSlug];
    let categoryName = CATEGORY_NAMES[catSlug];
    let tags = ACTIVITY_TAGS[catSlug];

    // Fallback logic - try to guess from place name if we don't have specific category
    if (!emoji || emoji === "🏛️") {
      const placeName = (f.properties.name || "").toLowerCase();

      if (
        placeName.includes("restaurant") ||
        placeName.includes("grill") ||
        placeName.includes("bistro")
      ) {
        emoji = "🍽️";
        categoryName = "Restaurant";
        tags = ["Dining", "Food", "Cuisine"];
      } else if (placeName.includes("cafe") || placeName.includes("coffee")) {
        emoji = "☕";
        categoryName = "Cafe";
        tags = ["Coffee", "Casual", "Relaxing"];
      } else if (
        placeName.includes("bar") ||
        placeName.includes("pub") ||
        placeName.includes("tavern")
      ) {
        emoji = "🍸";
        categoryName = "Bar";
        tags = ["Drinks", "Social", "Nightlife"];
      } else if (placeName.includes("museum")) {
        emoji = "🖼️";
        categoryName = "Museum";
        tags = ["Culture", "Education", "History"];
      } else if (placeName.includes("park")) {
        emoji = "🌳";
        categoryName = "Park";
        tags = ["Nature", "Walking", "Family Friendly"];
      } else if (
        placeName.includes("theater") ||
        placeName.includes("theatre") ||
        placeName.includes("cinema")
      ) {
        emoji = "🎭";
        categoryName = "Theatre";
        tags = ["Shows", "Culture", "Performance"];
      } else if (placeName.includes("hotel") || placeName.includes("inn")) {
        emoji = "🏨";
        categoryName = "Hotel";
        tags = ["Stay", "Rest", "Travel"];
      } else if (placeName.includes("mall") || placeName.includes("shopping")) {
        emoji = "🛍️";
        categoryName = "Shopping";
        tags = ["Shopping", "Retail", "Browse"];
      } else if (placeName.includes("gym") || placeName.includes("fitness")) {
        emoji = "💪";
        categoryName = "Fitness";
        tags = ["Exercise", "Health", "Wellness"];
      } else if (placeName.includes("spa")) {
        emoji = "🧘";
        categoryName = "Spa";
        tags = ["Relaxing", "Wellness", "Luxury"];
      } else {
        // Use different emojis for variety even if we can't determine exact type
        const fallbackEmojis = ["🏛️", "🎯", "⭐", "🎪", "🎨", "🏺", "🎢", "🌟"];
        emoji = fallbackEmojis[index % fallbackEmojis.length];
        categoryName = categoryName || "Tourism";
        tags = tags || ["Sightseeing", "Culture", "Local"];
      }
    }

    return {
      id: f.properties.place_id || `activity-${index}`,
      name: f.properties.name || "Unknown Place",
      location: f.properties.address_line1 || city,
      category: categoryName,
      rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10, // Random rating 3.5-5.0
      description:
        f.properties.description ||
        generateDescription(
          f.properties.name || "Unknown Place",
          categoryName,
          city
        ),
      image: emoji,
      tags: tags,
    };
  });
}
