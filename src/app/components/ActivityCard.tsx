"use client";

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
}

export default function ActivityCard({
  activity,
  selectedTag,
  onTagClick,
}: ActivityCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
        <div className="flex justify-between items-start mb-2">
          <span className="text-4xl">{activity.image}</span>
          <button
            className="text-white/80 hover:text-white text-xl transition-colors"
            title="Remove from favorites"
          >
            ❤️
          </button>
        </div>
        <h3 className="font-bold text-xl mb-1">{activity.name}</h3>
        <p className="text-cyan-100 text-sm">📍 {activity.location}</p>
      </div>

   
      <div className="p-6">
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

       
        <div className="flex flex-wrap gap-2 mb-4">
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

        
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
            View Details
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200">
            📍
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Activity };
