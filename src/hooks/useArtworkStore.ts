import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "vibetrack_custom_artwork";

interface ArtworkMap {
  [songId: string]: string; // base64 data URL
}

let globalArtwork: ArtworkMap = {};
let listeners: Set<() => void> = new Set();

function loadArtwork(): ArtworkMap {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveArtwork(map: ArtworkMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

globalArtwork = loadArtwork();

function notify() {
  listeners.forEach((l) => l());
}

export function getArtwork(songId: string): string | null {
  return globalArtwork[songId] || null;
}

export function setArtwork(songId: string, dataUrl: string) {
  globalArtwork = { ...globalArtwork, [songId]: dataUrl };
  saveArtwork(globalArtwork);
  notify();
}

export function removeArtwork(songId: string) {
  const { [songId]: _, ...rest } = globalArtwork;
  globalArtwork = rest;
  saveArtwork(globalArtwork);
  notify();
}

export function useArtworkStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const getSongArtwork = useCallback((songId: string): string | null => {
    return globalArtwork[songId] || null;
  }, []);

  return { getSongArtwork, setArtwork, removeArtwork };
}

export async function cropAndResizeImage(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
  targetSize = 512
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        img,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, targetSize, targetSize
      );
      const quality = 0.85;
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}
