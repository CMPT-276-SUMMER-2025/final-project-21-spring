"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Home() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const location = formData.get("location") as string;

    if (location.trim()) {
      
      router.push(`/activities?city=${encodeURIComponent(location.trim())}`);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-30">
        <h1 className="font-bold text-9xl">CloudCue</h1>
        <h1 className="font-bold text-xl text-center text-gray-500">
          CloudCue suggests the best things to do in BC—rain or shine.<br></br>
          Personalized, weather-smart recommendations so you can make the most
          of every day.
        </h1>
      </div>

      <div className="flex justify-center mt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <input
            className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            type="text"
            id="location"
            name="location"
            placeholder="Enter your location (e.g., Vancouver)"
            required
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 hover:cursor-pointer text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Find Activities
          </button>
        </form>
      </div>
    </>
  );
}
