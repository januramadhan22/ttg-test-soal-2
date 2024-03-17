import React, { useRef, useState } from "react";
import { FaTrashAlt, FaPlay, FaStop, FaPause, FaFlag } from "react-icons/fa";

function App() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // handle to running stopwatch
  const handleStartStopwatch = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      setElapsedTime(elapsed);
    }, 10);
  };

  // handle to pause stopwatch
  const handlePauseStopwatch = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // handle to reset stopwatch
  const handleResetStopwatch = () => {
    setElapsedTime(0);
    setLaps([]);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // handle to flag the time
  const handleFlagTime = () => {
    if (isRunning) {
      const lapTime = elapsedTime;
      setLaps((prevLaps) => [...prevLaps, lapTime]);
    }
  };

  const formatTime = (timeInMilliseconds: number): string => {
    const minutes = Math.floor((timeInMilliseconds / 60000) % 60);
    const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
    const milliseconds = Math.floor((timeInMilliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(milliseconds).padStart(3, "0")}`;
  };

  return (
    <div className="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center gap-5 bg-gray-200">
      <div className="text-7xl font-medium">
        <p>{formatTime(elapsedTime)}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          title={isRunning ? "Pause" : "Start"}
          onClick={isRunning ? handlePauseStopwatch : handleStartStopwatch}
          className="px-6 py-2 rounded bg-green-600 text-white font-medium uppercase hover:brightness-110"
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <FaPause />
              Pause
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FaPlay />
              Start
            </span>
          )}
        </button>
        <button
          title="Stop"
          onClick={handleResetStopwatch}
          className="px-6 py-2 flex items-center gap-2 rounded bg-red-600 text-white font-medium uppercase hover:brightness-110"
        >
          <FaStop /> Stop
        </button>
        <button
          title="Flag"
          onClick={handleFlagTime}
          disabled={!isRunning}
          className={`px-6 py-2 flex items-center gap-2 rounded text-white font-medium uppercase  ${
            !isRunning ? "bg-gray-500" : "bg-yellow-500 hover:brightness-110"
          }`}
        >
          <FaFlag /> Flag
        </button>
      </div>
      <div className="w-96 p-3 flex flex-col items-center gap-2 border-2 border-white rounded bg-white bg-opacity-35 backdrop-blur-md shadow-md">
        <div className="w-full flex justify-between items-baseline">
          <h3 className="text-2xl font-medium">Flag History</h3>
          <button
            onClick={() => setLaps([])}
            title="Clear All"
            className="text-red-600 text-lg"
          >
            <FaTrashAlt />
          </button>
        </div>

        <div
          className={`mt-3 w-full h-[200px] flex flex-col items-center gap-4 overflow-y-auto`}
        >
          {laps?.length !== 0 ? (
            laps.map((flag, index) => (
              <div
                key={index}
                className={`w-full pb-2 text-3xl text-black text-center ${
                  index !== laps.length - 1 ? "border-b border-gray-300" : ""
                }`}
              >
                <p>{formatTime(flag)}</p>
              </div>
            ))
          ) : (
            <div className="h-full flex justify-center items-center text-gray-500">
              No any flagged time
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
