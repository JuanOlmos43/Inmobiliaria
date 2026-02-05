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
    })),
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md"
          >
            {/* Number Badge */}
            <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm shadow-sm ring-1 ring-white/20">
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
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
              {/* Move Left */}
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveImage(index, "left")}
                className={`p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors ${index === 0 ? "opacity-30 cursor-not-allowed hidden" : ""}`}
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
                className="p-2 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
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
                className={`p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors ${index === items.length - 1 ? "opacity-30 cursor-not-allowed hidden" : ""}`}
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

        <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-video cursor-pointer hover:border-(--accent) hover:bg-gray-50 transition-all group relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-(--accent)/10 group-hover:text-(--accent) transition-all mb-2 group-hover:scale-110">
            <span className="text-3xl text-gray-400 group-hover:text-(--accent) leading-none pb-1">
              +
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium group-hover:text-(--accent)">
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
