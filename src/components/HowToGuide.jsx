import React, { useState } from "react";
import { translations } from "../translations/languages";

import howTo1 from "../howTo/1.png";
import howTo2 from "../howTo/2.png";
import howTo3 from "../howTo/3.png";
import howTo4 from "../howTo/4.png";
import howTo5 from "../howTo/5.png";
import howTo6 from "../howTo/6.png";
import howTo7 from "../howTo/7.png";
import howTo8 from "../howTo/8.png";
import howTo9 from "../howTo/9.png";
import howTo10 from "../howTo/10.png";
import howTo11 from "../howTo/11.png";

const howToImages = [
  howTo1,
  howTo2,
  howTo3,
  howTo4,
  howTo5,
  howTo6,
  howTo7,
  howTo8,
  howTo9,
  howTo10,
  howTo11,
];

const slideDescriptions = [
  "Perhatikan Lawan Pertama anda.",
  "Pilih player lawan pertama anda pada menu dropdown.",
  "Perhatikan lawan kedua anda, dan lawan kedua dari lawan pertama sebelumnya",
  "Input pada Round 2.",
  "Lawan berikutnya akan diisi secara otomatis di tabel.",
  "Perhatikan kembali lawan anda, dan lawan dari lawan pertama sebelumnya.",
  "Input kedua nya pada Round 4.",
  "Lawan berikutnya akan diisi secara otomatis di tabel.",
  "Perhatikan lawan anda di Round 3, dan lawan dari lawan pertama sebelumnya.",
  "input pada Round 6, di kedua Card *note: jangan sampai terbalik, perhatikan nama nya.",
  "Hasil prediksi selesai, *note: prediksi akan berubah ketika ada satu atau dua player yang TERELIMINASI.",
];

const HowToGuide = ({ language, showHowTo, setShowHowTo }) => {
  const [currentHowToImage, setCurrentHowToImage] = useState(1);
  const totalHowToImages = 11;
  const t = translations[language];

  const changeHowToImage = (direction) => {
    if (direction === "next") {
      setCurrentHowToImage((prev) =>
        prev === totalHowToImages ? 1 : prev + 1
      );
    } else {
      setCurrentHowToImage((prev) =>
        prev === 1 ? totalHowToImages : prev - 1
      );
    }
  };

  if (!showHowTo) return null;

  return (
    <div className="lg:col-span-3">
      <div className="p-4 transition-all border rounded-lg shadow-xl bg-gray-900/80 backdrop-blur-md border-violet-500/30 hover:shadow-violet-500/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{t.howTo.title}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-indigo-300">
              {currentHowToImage} / {totalHowToImages}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => changeHowToImage("prev")}
            className="absolute z-10 p-2 transition-all transform -translate-y-1/2 bg-black rounded-full opacity-70 left-2 top-1/2 hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="overflow-hidden rounded-lg">
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <img
                src={howToImages[currentHowToImage - 1]}
                alt={`How to step ${currentHowToImage}`}
                className="object-contain w-full h-full rounded-lg shadow-lg"
              />
            </div>
            <div className="p-3 text-center md:p-4 bg-gray-800/90">
              <h3 className="mb-2 text-base font-semibold text-indigo-300 md:text-lg">
                {t.howTo.title} - {t.step} {currentHowToImage}
              </h3>
              <p className="text-xs text-gray-300 md:text-sm">
                {slideDescriptions[currentHowToImage - 1]}
              </p>
            </div>
          </div>

          <button
            onClick={() => changeHowToImage("next")}
            className="absolute z-10 p-2 transition-all transform -translate-y-1/2 bg-black rounded-full opacity-70 right-2 top-1/2 hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mt-4 space-x-1 md:space-x-2">
          {Array.from({ length: totalHowToImages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHowToImage(i + 1)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                currentHowToImage === i + 1
                  ? "bg-violet-500"
                  : "bg-gray-600 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(HowToGuide);
