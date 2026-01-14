// src/components/common/ImageUpload.jsx
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImageUpload({
  images = [],
  onChange,
  maxImages = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/*',
  label = 'Upload Images',
}) {
  const [previews, setPreviews] = useState(images);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Validate file count
    if (previews.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file size and type
    const validFiles = [];
    files.forEach((file) => {
      if (file.size > maxSize) {
        setError(`${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not a valid image file`);
        return;
      }
      validFiles.push(file);
    });

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreview = {
          id: Date.now() + Math.random(),
          url: reader.result,
          file: file,
        };
        const updated = [...previews, newPreview];
        setPreviews(updated);
        onChange?.(updated);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id) => {
    const updated = previews.filter((preview) => preview.id !== id);
    setPreviews(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Upload Area */}
      {previews.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition cursor-pointer"
        >
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-600">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500 mt-1">
            PNG, JPG up to {maxSize / 1024 / 1024}MB (Max {maxImages} images)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview) => (
            <div key={preview.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                {preview.url ? (
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-gray-400" size={32} />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleRemove(preview.id)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


