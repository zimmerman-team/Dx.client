import { useState, useRef } from "react";

// Format time with millisecond precision
export const formatRemainingTime = (remainingSeconds: number) => {
  if (remainingSeconds <= 0) return "Finishing up...";

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);
  const milliseconds = Math.floor((remainingSeconds % 1) * 1000);

  if (minutes === 0) {
    if (seconds === 0) {
      return `${milliseconds} milliseconds remaining`;
    }
    return `${seconds}.${milliseconds
      .toString()
      .padStart(3, "0")} seconds remaining`;
  }

  return `${minutes} minutes and ${seconds}.${milliseconds
    .toString()
    .padStart(3, "0")} seconds remaining`;
};

export const useUploadProgress = () => {
  // Track file size info
  const [loadedProgress, setLoadedProgress] = useState("0B");
  const [percentageLoadedProgress, setPercentageLoadedProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  // Track precise timing
  const uploadStartTime = useRef<number>(0);
  const lastProgressTime = useRef<number>(0);
  const lastLoaded = useRef<number>(0);
  const uploadSpeed = useRef<number>(0);

  const onUploadProgress = (progressEvent: any) => {
    const { loaded, total } = progressEvent;
    const now = Date.now();

    // Initialize start time if this is the first progress event
    if (lastLoaded.current === 0) {
      uploadStartTime.current = now;
    }

    // Calculate upload speed based on real data (bytes per millisecond)
    // Use short-term speed for more accuracy if possible
    if (lastProgressTime.current > 0) {
      const timeDelta = now - lastProgressTime.current;
      const byteDelta = loaded - lastLoaded.current;

      if (timeDelta > 0 && byteDelta > 0) {
        // Calculate bytes per millisecond from recent sample
        const recentSpeed = byteDelta / timeDelta;
        // Smooth speed calculation with 30% weight to recent measurement
        uploadSpeed.current =
          uploadSpeed.current === 0
            ? recentSpeed
            : uploadSpeed.current * 0.7 + recentSpeed * 0.3;
      }
    } else if (now > uploadStartTime.current) {
      // Fall back to average speed since beginning
      const elapsedMs = now - uploadStartTime.current;
      uploadSpeed.current = loaded / elapsedMs;
    }

    // Format loaded progress for display
    const KB = 1024;
    const MB = 1048576;

    let loadedProgressValue = `${loaded}B`;
    if (loaded >= KB && loaded < MB) {
      loadedProgressValue = `${(loaded / KB).toFixed(2)}KB`;
    }
    if (loaded >= MB) {
      loadedProgressValue = `${(loaded / MB).toFixed(2)}MB`;
    }

    // Calculate percentage
    const percentage = Math.min(99.9, (loaded * 100) / total); // Cap at 99.9% until complete

    // Calculate remaining time based on current upload speed
    let remaining = 0;
    if (uploadSpeed.current > 0) {
      const bytesRemaining = total - loaded;
      remaining = bytesRemaining / uploadSpeed.current / 1000; // convert to seconds with millisecond precision
    }

    // Update state
    setLoadedProgress(loadedProgressValue);
    setPercentageLoadedProgress(Math.floor(percentage));
    setRemainingTime(remaining);

    // Update reference for next calculation
    lastLoaded.current = loaded;
    lastProgressTime.current = now;
  };

  return {
    loadedProgress,
    percentageLoadedProgress,
    remainingTime,
    remainingTimeFormatted: formatRemainingTime(remainingTime),
    rawRemainingTimeMs: Math.floor(remainingTime * 1000), // Raw milliseconds for custom formatting
    onUploadProgress,
    resetProgress: () => {
      setLoadedProgress("0B");
      setPercentageLoadedProgress(0);
      setRemainingTime(0);
      uploadStartTime.current = 0;
      lastProgressTime.current = 0;
      lastLoaded.current = 0;
      uploadSpeed.current = 0;
    },
  };
};
