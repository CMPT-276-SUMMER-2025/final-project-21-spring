"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Activity } from "../components/ActivityCard";

interface FavoritesContextType {
  favorites: Activity[];
  addToFavorites: (activity: Activity) => void;
  removeFromFavorites: (activityId: string) => void;
  isFavorite: (activityId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

/**
 * Provider component that manages the favorites state across the entire app.
 * Handles localStorage persistence so users don't lose their favorites on refresh.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Activity[]>([]);

  // Load favorites from localStorage when the component first mounts
  // Using try/catch because localStorage can throw errors in some browsers/modes
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        // If localStorage data is corrupted, just log it and continue with empty array
        console.error("Error loading favorites from localStorage:", error);
      }
    }
  }, []);

  // Auto-save to localStorage whenever favorites array changes
  // This ensures we never lose user's favorites even if they close the browser
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (activity: Activity) => {
    setFavorites((prev) => {
      // Prevent duplicates - check if activity is already in favorites
      if (prev.some((fav) => fav.id === activity.id)) {
        return prev; // No changes needed
      }
      return [...prev, activity];
    });
  };

  const removeFromFavorites = (activityId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== activityId));
  };

  // Helper function to check if an activity is already favorited
  // Useful for showing different UI states (heart vs plus icon)
  const isFavorite = (activityId: string) => {
    return favorites.some((fav) => fav.id === activityId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Custom hook to access favorites context.
 * Throws an error if used outside of FavoritesProvider to catch developer mistakes early.
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
