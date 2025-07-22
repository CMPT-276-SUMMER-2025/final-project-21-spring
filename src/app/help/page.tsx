"use client";

export default function Help() {
  const helpSections = [
    {
      title: "Getting Started",
      icon: "🚀",
      questions: [
        {
          q: "What is CloudCue?",
          a: "CloudCue is your weather-smart activity recommendation app for British Columbia. We help you discover amazing outdoor activities and attractions based on current weather conditions.",
        },
        {
          q: "How do I search for activities?",
          a: "Simply enter your city name on the home page and click search. We'll show you activities in that area along with weather-appropriate recommendations.",
        },
      ],
    },
    {
      title: "Using Favorites",
      icon: "⭐",
      questions: [
        {
          q: "How do I save activities to favorites?",
          a: "Click the heart icon (❤️) on any activity card to add it to your favorites. You can view all your saved activities on the Favorites page.",
        },
        {
          q: "How do I filter my favorites?",
          a: "On the Favorites page, use the tag filters (Walking, Cycling, Family Friendly, Adrenaline) to quickly find specific types of activities.",
        },
        {
          q: "Can I remove activities from favorites?",
          a: "Yes! Click the heart icon again on any favorited activity to remove it from your favorites list.",
        },
      ],
    },
    {
      title: "Weather Integration",
      icon: "🌤️",
      questions: [
        {
          q: "How does weather affect activity recommendations?",
          a: "CloudCue considers current weather conditions to suggest the best activities for the day. Indoor activities are prioritized during rain, while outdoor activities shine on sunny days.",
        },
        {
          q: "What weather data do you use?",
          a: "We integrate with reliable weather APIs to provide real-time weather information for accurate activity recommendations.",
        },
      ],
    },
    {
      title: "Navigation & Features",
      icon: "🗺️",
      questions: [
        {
          q: "How do I navigate between pages?",
          a: "Use the navigation bar at the top of the page. You can access Home, Activities, Favorites, and Help from anywhere in the app.",
        },
        {
          q: "What do the activity tags mean?",
          a: "Tags help categorize activities: Walking (easy strolls), Cycling (bike-friendly), Family Friendly (suitable for all ages), and Adrenaline (exciting adventures).",
        },
        {
          q: "How do I view activity details?",
          a: "Click 'View Details' on any activity card to see more information, photos, and location details.",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
     
      <div className="text-center mb-12">
        <h1 className="font-bold text-6xl mb-4">🆘 Help & Support</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about using CloudCue to discover amazing
          activities in BC
        </p>
      </div>

     
      <div className="max-w-4xl mx-auto space-y-8">
        {helpSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{section.icon}</span>
              <h2 className="text-2xl font-bold text-gray-800">
                {section.title}
              </h2>
            </div>

            
            <div className="space-y-4">
              {section.questions.map((item, qIndex) => (
                <div key={qIndex} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {item.q}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>


      
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-lg text-yellow-800 mb-2">
                Pro Tips
              </h3>
              <ul className="text-yellow-700 space-y-1">
                <li>
                  • Use specific city names for better activity recommendations
                </li>
                <li>
                  • Check the weather icon on activities for outdoor suitability
                </li>
                <li>
                  • Save multiple activities to create your perfect day
                  itinerary
                </li>
                <li>
                  • Try different tag filters to discover new types of
                  activities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
