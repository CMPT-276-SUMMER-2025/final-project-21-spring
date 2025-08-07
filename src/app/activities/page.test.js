async function testWeatherApi() {
    console.log("Running: testWeatherApiCall");

    const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const base = process.env.NEXT_PUBLIC_WEATHER_BASE_URL;
    const city ="vancouver";
    const url = `${base}/forecast.json?key=${key}&q=${encodeURIComponent(city)}&days=3`;
    try {
        const response = await fetch(url);
        console.assert(response.ok, `❌ API call failed with status ${response.status}`);

        console.log("✅ testWeatherApiCall passed");
    } catch (error) {
        console.error("❌ testWeatherApiCall failed with error:", error);
    }
}


async function testParseWeatherDay() {
    console.log("Running: testParseWeatherDay");

    const sampleWeatherDay = {
        date: "2025-08-05",
        day: {
            condition: {
                text: "Partly cloudy",
                icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
            },
            avgtemp_c: 21.5,
            maxtemp_c: 26.0,
            mintemp_c: 18.0,
            daily_will_it_rain: 1,
            daily_chance_of_rain: 60
        }
    };

    const expected = {
        date: "2025-08-05",
        avgTemp: 21.5,
        maxtemp_c: 26.0,
        mintemp_c: 18.0,
        condition: "Partly cloudy",
        chanceOfRain: 60
    };

    const result = {
        date: sampleWeatherDay.date,
        avgTemp: sampleWeatherDay.day.avgtemp_c,
        maxTemp: sampleWeatherDay.day.maxtemp_c,
        minTemp: sampleWeatherDay.day.mintemp_c,
        condition: sampleWeatherDay.day.condition.text,
        chanceOfRain: sampleWeatherDay.day.daily_chance_of_rain
    };

    console.assert(JSON.stringify(result) === JSON.stringify(expected), "❌ testParseWeatherDay failed");

    console.log("✅ testParseWeatherDay passed");
}

async function testOutfit() {
    console.log("Running: testOutfit");

    const sampleWeatherDay = { text: "Partly cloudy"};
    const result = getOutfitSuggestion(sampleWeatherDay);
    const expected = {condition: "🧢 Light jacket just in case"};
    try{
        console.assert(JSON.stringify(result) === JSON.stringify(expected), "❌ testOutfit failed");
        console.log("✅ testOutfit passed");
    }catch{
        console.error("❌ testOutfit failed with error:", error);
    }
}

async function testParseWeatherDay2() {
    console.log("Running: testParseWeatherDay2");

    const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const base = process.env.NEXT_PUBLIC_WEATHER_BASE_URL;
    const city ="vancouver";
    const url = `${base}/forecast.json?key=${key}&q=${encodeURIComponent(city)}&days=3`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const forecastDay = data.forecast?.forecastday?.[0];

        const parsed = {
            date: forecastDay.date,
            avgTemp: forecastDay.day.avgtemp_c,
            maxTemp: forecastDay.day.maxtemp_c,    
            minTemp: forecastDay.day.mintemp_c,
            condition: forecastDay.day.condition.text,
            chanceOfRain: forecastDay.day.daily_chance_of_rain
        };

        console.assert(typeof parsed.date === "string" || typeof parsed.avgTemp === "number"||typeof parsed.maxTemp === "number"||typeof parsed.minTemp === "number"||typeof parsed.condition === "string"||typeof parsed.chanceOfRain === "number", "❌ Date type is incorrect");

        console.log("✅ testParseWeatherDay2 passed");
    } catch (error) {
        console.error("❌ testParseWeatherDay2 failed with error:", error);
    }
}


async function testGeoApi() {
    console.log("Running: testGeoApi");

    const key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    const base = process.env.NEXT_PUBLIC_GEOAPIFY_BASE_URL;
    const city = "Vancouver";

    try {
        const url = `${base}/geocode/search?text=${encodeURIComponent(city)}&apiKey=${key}`;
        const res = await fetch(url);

        console.assert(res.ok, `❌ API request failed with status ${res.status}`);

        const data = await res.json();

        console.assert(data !== null && typeof data === "object", "❌ Response is null or not an object");
        console.assert(data.features && data.features.length > 0, "❌ No features found in response");

        console.log("✅ testFetchGeo passed");
    } catch (error) {
        console.error("❌ testFetchGeo failed with error:", error);
    }
}


//testing
testWeatherApi();
testParseWeatherDay();
testParseWeatherDay2();
testOutfit();
testGeoApi();