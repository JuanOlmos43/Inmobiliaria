import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageSectionProps {
  initialUrls?: string[];
  onFilesChange: (files: File[]) => void;
  onExistingImagesChange: (urls: string[]) => void;
}

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isExisting: boolean;
}

export default function ImageSection({
  initialUrls = [],
  onFilesChange,
  onExistingImagesChange,
}: ImageSectionProps) {
  const [items, setItems] = useState<ImageItem[]>(() =>
    initialUrls.map((url) => ({
      id: url,
      url,
      isExisting: true,
    }))
  );

  // Effect to notify parent whenever items change
  useEffect(() => {
    const existingUrls = items.filter((i) => i.isExisting).map((i) => i.url);
    const newFiles = items.filter((i) => !i.isExisting).map((i) => i.file!);

    onExistingImagesChange(existingUrls);
    onFilesChange(newFiles);
  }, [items, onExistingImagesChange, onFilesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newItems: ImageItem[] = filesArray.map((file) => ({
        id: URL.createObjectURL(file),
        url: URL.createObjectURL(file),
        file,
        isExisting: false,
      }));

      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const removeImage = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index > 0) {
      setItems((prev) => {
        const newItems = [...prev];
        const temp = newItems[index];
        newItems[index] = newItems[index - 1];
        newItems[index - 1] = temp;
        return newItems;
      });
    } else if (direction === "right" && index < items.length - 1) {
      setItems((prev) => {
        const newItems = [...prev];
        const temp = newItems[index];
        newItems[index] = newItems[index + 1];
        newItems[index + 1] = temp;
        return newItems;
      });
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Imágenes ({items.length})
      </label>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm transition-all hover:shadow-md"
          >
            {/* Number Badge */}
            <div className="absolute top-2 left-2 z-10 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white shadow-sm ring-1 ring-white/20 backdrop-blur-sm">
              #{index + 1}
            </div>

            <Image
              src={item.url}
              fill
              className="object-cover"
              alt={`Propiedad ${index + 1}`}
              unoptimized={item.url.startsWith("blob:")}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
              {/* Move Left */}
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveImage(index, "left")}
                className={`rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40 ${index === 0 ? "hidden cursor-not-allowed opacity-30" : ""}`}
                title="Mover al anterior"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="rounded-full bg-red-500/90 p-2 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600"
                title="Eliminar imagen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {/* Move Right */}
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => moveImage(index, "right")}
                className={`rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40 ${index === items.length - 1 ? "hidden cursor-not-allowed opacity-30" : ""}`}
                title="Mover al siguiente"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <label className="group relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-(--accent) hover:bg-gray-50">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-all group-hover:scale-110 group-hover:bg-(--accent)/10 group-hover:text-(--accent)">
            <span className="pb-1 text-3xl leading-none text-gray-400 group-hover:text-(--accent)">
              +
            </span>
          </div>
          <span className="text-xs font-medium text-gray-500 group-hover:text-(--accent)">
            Agregar foto
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
