# CloudCue 🌤️

A weather-smart activity discovery app for the world that helps you find the perfect things to do based on current weather conditions.

### Group Members

Nok Tim Yeung 301649679 <br>
Tallal Mohar 301465076 <br>
Hao Ran (Howard) Jin 301581343 <br>
Amar Sinha 301637890 <br>

## 🚀 Features

- **Weather-Smart Recommendations**: Get activity suggestions tailored to current weather conditions
- **3-Day Weather Forecast**: View detailed weather forecasts with outfit suggestions
- **Activity Discovery**: Explore museums, parks, restaurants, entertainment venues, and more
- **Favorites System**: Save and organize your favorite activities
- **Tag-Based Filtering**: Filter activities by categories like "Family Friendly", "Outdoor", "Culture", etc.
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.3.3](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**: Weather API & Geoapify Places API

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd final-project-21-spring
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   For this to work you will have to make your own API KEY
   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
   NEXT_PUBLIC_WEATHER_BASE_URL=your_weather_api_base_url
   NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key
   NEXT_PUBLIC_GEOAPIFY_BASE_URL=your_geoapify_base_url
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm test
```

## 📁 Project Structure

```
src/
├── app/
│   ├── activities/          # Activities discovery page
│   ├── components/          # Reusable components
│   ├── context/            # React context providers
│   ├── favorites/          # Favorites management page
│   ├── help/              # Help and support page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
```

## 🎯 Key Components

### Activities Page

- Displays weather forecast and activity recommendations
- Implements tag-based filtering system
- Handles API calls to weather and places services

### Favorites System

- Manages user's saved activities
- Provides context for favorites across the app
- Persists data using localStorage

### Activity Cards

- Displays individual activity information
- Handles favoriting functionality
- Provides external links to Google Maps and search

## 🌟 Features in Detail

### Weather Integration

- Real-time weather data for accurate recommendations
- 3-day forecast with temperature ranges and conditions
- Smart outfit suggestions based on weather conditions

### Activity Discovery

The app categorizes activities into various types:

- **Tourism**: Museums, monuments, viewpoints, zoos
- **Entertainment**: Cinemas, theaters, nightclubs, casinos
- **Leisure**: Parks, beaches, sports facilities, spas
- **Dining**: Restaurants, cafes, bars, fast food
- **Shopping**: Malls, markets, specialty stores

### Tag System

Activities are tagged with relevant categories:

- Family Friendly
- Outdoor/Indoor
- Culture & History
- Active & Sports
- Relaxing
- And many more...

## 🔧 Configuration

The app uses several configuration files:

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 🚀 CI/CD

GitHub Actions workflow handles:

- Automated testing on push/PR
- Build verification
- API connectivity testing

## 📝 Project Description

CloudCue is a comprehensive weather-aware activity discovery platform designed specifically for British Columbia. The application intelligently combines real-time weather data with local activity recommendations to help users make informed decisions about what to do and where to go.

The app addresses the common problem of planning activities without considering weather conditions. By integrating weather forecasts with activity suggestions, users can discover indoor alternatives during rainy days or find the perfect outdoor adventures when the sun is shining.

Key features include a smart favorites system that persists across sessions, tag-based filtering for easy activity discovery, and detailed weather forecasts with practical outfit suggestions. The responsive design ensures a seamless experience across all devices.


## 🔮 Future Enhancements

- User accounts and personalized recommendations
- Social sharing features
- Integration with booking platforms
- Advanced weather alerts and notifications
- Machine learning-based activity suggestions

---

*Made with ❤️ in Beautiful British Columbia*
