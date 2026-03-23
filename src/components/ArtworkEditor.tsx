import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, RotateCw, Trash2, Check, ImageIcon } from "lucide-react";
import { setArtwork, removeArtwork, cropAndResizeImage } from "@/hooks/useArtworkStore";
import { Song } from "@/data/mockSongs";
import { toast } from "@/hooks/use-toast";

interface ArtworkEditorProps {
  song: Song;
  open: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ArtworkEditor = ({ song, open, onClose }: ArtworkEditorProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, area: Area) => {
    setCroppedArea(area);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Max 5MB allowed", variant: "destructive" });
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({ title: "Invalid format", description: "Use JPG, PNG, or WEBP", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedArea) return;
    setSaving(true);
    try {
      const result = await cropAndResizeImage(imageSrc, croppedArea, 512);
      setArtwork(song.id, result);
      toast({ title: "Artwork saved", description: `Updated artwork for "${song.title}"` });
      onClose();
    } catch {
      toast({ title: "Error", description: "Failed to save artwork", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    removeArtwork(song.id);
    toast({ title: "Artwork removed", description: "Reset to original artwork" });
    onClose();
  };

  const handleClose = () => {
    setImageSrc(null);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-[430px] bg-card rounded-t-3xl border border-border p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Edit Artwork</h2>
            <button onClick={handleClose} className="p-2 rounded-full bg-secondary text-secondary-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Song info */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-secondary/50">
            <img src={song.coverUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{song.title}</p>
              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
            </div>
          </div>

          {!imageSrc ? (
            /* Upload options */
            <div className="space-y-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />

              <button
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-surface-hover transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Choose from Gallery</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WEBP • Max 5MB</p>
                </div>
              </button>

              <button
                onClick={handleRemove}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-surface-hover transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Remove Custom Artwork</p>
                  <p className="text-xs text-muted-foreground">Reset to original metadata artwork</p>
                </div>
              </button>
            </div>
          ) : (
            /* Cropper */
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-background">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="rect"
                  showGrid={false}
                  style={{
                    containerStyle: { borderRadius: "1rem" },
                  }}
                />
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold"
                  >
                    <RotateCw className="w-4 h-4" /> Rotate
                  </button>
                  <button
                    onClick={() => { setImageSrc(null); setCrop({ x: 0, y: 0 }); setZoom(1); setRotation(0); }}
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold"
                  >
                    <ImageIcon className="w-4 h-4" /> Change
                  </button>
                </div>
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {saving ? "Saving..." : "Save Artwork"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArtworkEditor;
