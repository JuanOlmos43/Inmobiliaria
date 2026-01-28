import { useState } from "react";

interface ImageSectionProps {
    initialUrls?: string[];
    onFilesChange: (files: File[]) => void;
    onExistingImagesChange: (urls: string[]) => void;
}

export default function ImageSection({
    initialUrls = [],
    onFilesChange,
    onExistingImagesChange,
}: ImageSectionProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(initialUrls);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const newFiles = [...selectedFiles, ...filesArray];
            setSelectedFiles(newFiles);
            onFilesChange(newFiles);

            const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const isExisting = index < initialUrls.length;

        if (isExisting) {
            const newExisting = previewUrls.filter((_, i) => i !== index);
            setPreviewUrls(newExisting);
            onExistingImagesChange(newExisting);
        } else {
            const fileIndex = index - initialUrls.length;
            const newFiles = selectedFiles.filter((_, i) => i !== fileIndex);
            setSelectedFiles(newFiles);
            onFilesChange(newFiles);

            const newPreviews = previewUrls.filter((_, i) => i !== index);
            setPreviewUrls(newPreviews);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Imágenes</label>
            <div className="grid grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-video">
                        <img src={url} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-video cursor-pointer hover:border-(--accent) transition-colors">
                    <span className="text-2xl text-gray-400">+</span>
                    <span className="text-xs text-gray-400 font-medium">Agregar foto</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
        </div>
    );
}
