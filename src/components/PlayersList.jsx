import React, { memo, useState, useRef, useEffect } from "react";
import { FaFileImage, FaPaste } from "../components/icons";

const PlayerCard = memo(
  ({
    id,
    isFirst,
    isEditing,
    playerName,
    onStartEdit,
    onSave,
    onKeyDown,
    onChange,
  }) => (
    <div
      className={`p-2 transition-all duration-300 rounded-lg border shadow-lg ${
        isFirst
          ? "bg-gradient-to-br from-violet-900/80 to-indigo-900/80 border-violet-500/50 hover:border-violet-400 hover:shadow-violet-500/20"
          : "bg-gray-800/90 border-gray-600/50 hover:border-gray-500 hover:shadow-indigo-500/10"
      }`}
    >
      <div className="flex items-center">
        <div className="flex-1">
          {isFirst && (
            <span className="text-xs font-semibold text-violet-300">
              Lawan Pertama:
            </span>
          )}
          <div
            className={`text-base font-medium cursor-pointer ${
              isFirst ? "text-indigo-200" : "text-gray-300"
            }`}
            onClick={onStartEdit}
          >
            {isEditing ? (
              <input
                type="text"
                placeholder={playerName}
                onChange={onChange}
                className={`w-full p-1 text-base font-medium text-white border rounded outline-none ${
                  isFirst
                    ? "bg-gray-700/90 border-violet-500/50 focus:border-violet-400"
                    : "bg-gray-700 border-gray-600 focus:border-gray-500"
                }`}
                autoFocus
                onBlur={onSave}
                onKeyDown={onKeyDown}
              />
            ) : (
              playerName
            )}
          </div>
        </div>
      </div>
    </div>
  )
);

const PlayersList = memo(
  ({
    playerNames,
    firstOpponentId,
    editingName,
    startEditName,
    savePlayerName,
    handleNameKeyDown,
    setTempName,
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);
    const dropZoneRef = useRef(null);

    const processImage = async (imageData) => {
      if (!imageData) return;

      if (imageData.size > 1048576) {
        setErrorMessage(
          "File size exceeds 1MB limit. Please select a smaller image."
        );
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      setShowModal(false); 

      try {
        let formData = new FormData();

        if (imageData instanceof File) {
          formData.append("image", imageData);
        } else if (imageData instanceof Blob) {
          formData.append(
            "image",
            new File([imageData], "clipboard-image.png")
          );
        }

        const response = await fetch(
          "https://settled-modern-stinkbug.ngrok-free.app/ocr",
          {
            method: "POST",
            body: formData,
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        const result = await response.json();

        if (result.success && result.players && result.players.length > 0) {
          // Update player names with OCR results
          const newNames = { ...playerNames };

          // Process up to 7 players (for indices 2-8)
          result.players.slice(0, 7).forEach((player, index) => {
            const playerId = index + 2; // Start from player 2
            if (playerId <= 8) {
              newNames[playerId] = player.name.trim();
            }
          });

          // Save all player names at once
          Object.entries(newNames).forEach(([id, name]) => {
            if (id >= 2 && id <= 8) {
              savePlayerName(parseInt(id), name);
            }
          });

          setSuccessMessage("Berhasil memuat nama pemain dari gambar");
          setTimeout(() => setSuccessMessage(""), 5000); 
          setErrorMessage(""); 
        } else {
          setErrorMessage("Tidak ada nama pemain yang terdeteksi");
          setTimeout(() => setErrorMessage(""), 5000);
        }
      } catch (error) {
        console.error("OCR processing error:", error);
        setErrorMessage(
          "Error Proses Gambar, Pastikan Server Aktif."
        );
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select an image file");
        return;
      }

      processImage(file);
    };

    const handlePaste = (event) => {
      const clipboardItems = event.clipboardData?.items;
      if (!clipboardItems) return;

      for (const item of clipboardItems) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          processImage(blob);
          event.preventDefault();
          break;
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      if (dropZoneRef.current) {
        dropZoneRef.current.classList.add("drag-over");
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (dropZoneRef.current) {
        dropZoneRef.current.classList.remove("drag-over");
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      if (dropZoneRef.current) {
        dropZoneRef.current.classList.remove("drag-over");
      }

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          processImage(file);
        } else {
          setErrorMessage("Please drop an image file");
        }
      }
    };

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    useEffect(() => {
      if (showModal) {
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("paste", handlePaste);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
          document.removeEventListener("paste", handlePaste);
        };
      }
    }, [showModal]);

    return (
      <div
        ref={containerRef}
        className="p-4 transition-all border rounded-lg shadow-xl bg-gray-900/80 backdrop-blur-md border-violet-500/30 hover:shadow-violet-500/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Pemain</h2>

          <button
            onClick={() => setShowModal(true)}
            className={`p-2 rounded-full bg-violet-600 hover:bg-violet-500 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            title="Scan dokumen untuk OCR nama pemain otomatis"
          >
            <FaFileImage size={16} className="text-white" />
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div
              ref={modalRef}
              className="w-full max-w-md p-5 bg-gray-800 border rounded-lg shadow-xl border-violet-500/30"
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium text-white">
                  Scan Dokumen Nama Pemain (OCR)
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Drop zone */}
              <div
                ref={dropZoneRef}
                className="flex flex-col items-center justify-center p-6 mb-4 transition-colors border-2 border-dashed rounded-lg cursor-pointer border-violet-500/40 hover:border-violet-500/60"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FaFileImage size={36} className="mb-3 text-violet-400" />
                <p className="mb-2 text-sm text-center text-gray-300">
                  Klik atau seret gambar ke sini untuk scan nama pemain otomatis
                </p>
                <p className="text-xs text-center text-gray-500">
                  atau tekan{" "}
                  <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs font-mono">
                    Ctrl
                  </kbd>
                  +
                  <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs font-mono">
                    V
                  </kbd>{" "}
                  untuk paste screenshot
                </p>
                <p className="mt-2 text-xs text-center text-gray-400">
                  Ukuran maksimum: 1MB
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  key={`file-input-${isLoading}`}
                />
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-2 mb-3 text-sm text-red-200 border rounded bg-red-900/50 border-red-500/50">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-2 mb-3 text-sm text-green-200 border rounded bg-green-900/50 border-green-500/50">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center p-2 mb-3 text-sm border rounded bg-violet-900/30 border-violet-500/50 text-violet-200">
            <svg
              className="w-4 h-4 mr-2 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Memproses gambar...
          </div>
        )}

        <div className="space-y-2">
          {[2, 3, 4, 5, 6, 7, 8].map((id) => (
            <PlayerCard
              key={id}
              id={id}
              isFirst={id === firstOpponentId}
              isEditing={editingName === id}
              playerName={playerNames[id]}
              onStartEdit={() => !editingName && startEditName(id)}
              onSave={(e) => savePlayerName(id, e.target.value)}
              onKeyDown={(e) => handleNameKeyDown(e, id)}
              onChange={(e) => setTempName(e.target.value)}
            />
          ))}

          <div className="mt-2 text-center">
            <p className="text-xs italic text-gray-400">
              Klik untuk mengubah
              <span className="ml-1 text-violet-400">•</span>
              <span className="ml-1 text-gray-400">Enter untuk lanjut</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default PlayersList;
