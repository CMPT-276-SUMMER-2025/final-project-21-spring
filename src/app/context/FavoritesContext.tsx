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

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Activity[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (activity: Activity) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === activity.id)) {
        return prev; // Already in favorites
      }
      return [...prev, activity];
    });
  };

  const removeFromFavorites = (activityId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== activityId));
  };

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

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
