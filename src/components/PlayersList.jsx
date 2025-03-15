import React, { memo } from "react";

const PlayerCard = memo(
  ({
    id,
    isFirst,
    isEditing,
    playerName,
    t,
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
              {t.firstOpponent}
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
    t,
    handleFirstOpponentChange,
    editingName,
    startEditName,
    savePlayerName,
    handleNameKeyDown,
    setTempName,
  }) => {
    return (
      <div className="p-4 transition-all border rounded-lg shadow-xl bg-gray-900/80 backdrop-blur-md border-violet-500/30 hover:shadow-violet-500/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{t.players}</h2>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-indigo-200">
              {t.firstOpponent}
            </label>
            <select
              value={firstOpponentId}
              onChange={(e) => handleFirstOpponentChange(e.target.value)}
              className="px-2 py-1 text-xs font-medium text-white transition-colors border rounded shadow-md bg-gray-800/90 border-violet-500/50 hover:border-violet-400"
            >
              {[2, 3, 4, 5, 6, 7, 8].map((id) => (
                <option key={id} value={id}>
                  {playerNames[id]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <PlayerCard
            id={1}
            isFirst={false}
            isEditing={editingName === 1}
            playerName={playerNames[1]}
            t={t}
            onStartEdit={() => !editingName && startEditName(1)}
            onSave={(e) => savePlayerName(1, e.target.value)}
            onKeyDown={(e) => handleNameKeyDown(e, 1)}
            onChange={(e) => setTempName(e.target.value)}
          />

          {[2, 3, 4, 5, 6, 7, 8].map((id) => (
            <PlayerCard
              key={id}
              id={id}
              isFirst={id === firstOpponentId}
              isEditing={editingName === id}
              playerName={playerNames[id]}
              t={t}
              onStartEdit={() => !editingName && startEditName(id)}
              onSave={(e) => savePlayerName(id, e.target.value)}
              onKeyDown={(e) => handleNameKeyDown(e, id)}
              onChange={(e) => setTempName(e.target.value)}
            />
          ))}

          <div className="mt-2 text-center">
            <p className="text-xs italic text-gray-400">
              {t.clickToChange}
              <span className="ml-1 text-violet-400">•</span>
              <span className="ml-1 text-gray-400">{t.enterToContinue}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default PlayersList;
