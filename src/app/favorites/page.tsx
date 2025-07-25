"use client";
import { useState } from "react";
import ActivityCard, { Activity } from "../components/ActivityCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();

  // Get all unique tags from the favorites
  const allTags = [...new Set(favorites.flatMap((activity) => activity.tags))];

  // State for selected tag filter
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter activities based on selected tag
  const filteredActivities = selectedTag
    ? favorites.filter((activity) => activity.tags.includes(selectedTag))
    : favorites;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-bold text-6xl mb-4">⭐ Your Favorite Activities</h1>
        <p className="text-xl text-gray-600">
          Your personally curated collection of amazing experiences
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 shadow-lg inline-block">
            <span className="text-6xl mb-4 block">📋</span>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-500">
              Start exploring activities and click the ➕ button to add them to
              your favorites!
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="max-w-4xl mx-auto mb-8">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Filter by tags:
              </h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
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
                {allTags.map((tag: string) => (
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
              {selectedTag && (
                <p className="text-center text-gray-500 text-sm">
                  Showing activities tagged with "{selectedTag}"
                </p>
              )}
            </div>
          )}

          {/* Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                selectedTag={selectedTag}
                onTagClick={setSelectedTag}
                showRemoveButton={true}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl p-6 shadow-lg inline-block">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {filteredActivities.length}{" "}
                {filteredActivities.length === 1 ? "Favorite" : "Favorites"}
                {selectedTag && ` with "${selectedTag}"`}
              </h3>
              <p className="text-gray-500">Ready for your next adventure!</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
