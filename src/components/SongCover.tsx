import { Music } from "lucide-react";
import { useArtworkStore } from "@/hooks/useArtworkStore";

interface SongCoverProps {
  songId: string;
  originalUrl: string;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-full aspect-square",
  xl: "w-72 h-72",
};

const SongCover = ({ songId, originalUrl, alt = "", className = "", size = "md" }: SongCoverProps) => {
  const { getSongArtwork } = useArtworkStore();
  const customArt = getSongArtwork(songId);
  const src = customArt || originalUrl;

  if (!src) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-secondary flex items-center justify-center ${className}`}>
        <Music className="w-1/3 h-1/3 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`${sizeClasses[size]} rounded-lg object-cover ${className}`}
    />
  );
};

export default SongCover;
