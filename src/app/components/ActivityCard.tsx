"use client";
import { useFavorites } from "../context/FavoritesContext";

interface Activity {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  description: string;
  image: string;
  tags: string[];
}

interface ActivityCardProps {
  activity: Activity;
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
  showRemoveButton?: boolean; // For favorites page to show remove instead of add
}

export default function ActivityCard({
  activity,
  selectedTag,
  onTagClick,
  showRemoveButton = false,
}: ActivityCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isActivityFavorite = isFavorite(activity.id);

  const handleFavoriteClick = () => {
    if (showRemoveButton || isActivityFavorite) {
      removeFromFavorites(activity.id);
    } else {
      addToFavorites(activity);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
        <div className="flex justify-between items-start mb-2">
          <span className="text-4xl">{activity.image}</span>
          <button
            onClick={handleFavoriteClick}
            className="text-white/80 hover:text-white text-xl transition-colors hover:scale-110 transform"
            title={
              showRemoveButton || isActivityFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {showRemoveButton || isActivityFavorite ? "❤️" : "➕"}
          </button>
        </div>
        <h3 className="font-bold text-xl mb-1">{activity.name}</h3>
        <p className="text-cyan-100 text-sm">📍 {activity.location}</p>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            {activity.category}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-semibold">{activity.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {activity.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
          {activity.tags.map((tag: string, index: number) => (
            <button
              key={index}
              onClick={() => onTagClick(tag)}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedTag === tag
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => {
              const searchQuery = `${activity.name} ${activity.location}`;
              const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
                searchQuery
              )}`;
              window.open(googleSearchUrl, "_blank");
            }}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            View Details
          </button>
          <button
            onClick={() => {
              const mapsQuery = `${activity.name} ${activity.location}`;
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                mapsQuery
              )}`;
              window.open(googleMapsUrl, "_blank");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            title="Open in Google Maps"
          >
            📍
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Activity };
