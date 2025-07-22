"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "Unknown Location";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-bold text-6xl mb-4">Activities in {city}</h1>
        <p className="text-xl text-gray-600">
          Discover the best things to do in {city} based on current weather
          conditions
        </p>
      </div>

     
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <p className="text-gray-500 text-lg">
          🎯 Activities for {city} will be displayed here based on weather
          conditions!
        </p>
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
