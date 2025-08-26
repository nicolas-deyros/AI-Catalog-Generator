import React, { useState, useCallback } from 'react';
import { CatalogItem } from '@types';
import Icon from '@components/Icon';
import Dialog from '@components/Dialog';

interface ImageUploaderProps {
  items: CatalogItem[];
  onItemsChange: (items: CatalogItem[]) => void;
}

const fileToResizedBase64 = (
  file: File,
  maxSize: number = 512
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if it's an image file by MIME type or file extension
    const supportedExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.webp',
      '.heic',
      '.heif',
    ];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));
    const isImageByMime = file.type.startsWith('image/');
    const isImageByExtension = supportedExtensions.includes(fileExtension);

    if (!isImageByMime && !isImageByExtension) {
      return reject(
        new Error(`File is not a supported image type: ${file.name}`)
      );
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error('FileReader event target is null'));
      }
      const img = new Image();
      img.src = event.target.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Get the base64 string, without the data URI prefix
        const base64String = canvas.toDataURL(file.type).split(',')[1];
        resolve(base64String);
      };
      img.onerror = () =>
        reject(
          new Error(
            `Failed to load image file: ${file.name}. It may be corrupted or an unsupported format.`
          )
        );
    };
    reader.onerror = () =>
      reject(new Error(`Failed to read file: ${file.name}`));
  });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  items,
  onItemsChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const handleFileChange = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const results = await Promise.allSettled(
        Array.from(files).map(async (file) => {
          const base64 = await fileToResizedBase64(file);
          return {
            id: `${file.name}-${Date.now()}`,
            file,
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for name
            objectURL: URL.createObjectURL(file),
            base64,
          };
        })
      );

      const newItems: CatalogItem[] = [];
      const failedFiles: string[] = [];

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newItems.push(result.value);
        } else {
          console.error('Failed to process file:', result.reason);
          // result.reason is an Error object, so we access its message
          failedFiles.push(result.reason?.message || 'An unknown file');
        }
      });

      if (newItems.length > 0) {
        onItemsChange([...items, ...newItems]);
      }

      if (failedFiles.length > 0) {
        setDialogState({
          isOpen: true,
          title: 'Upload Error',
          message: `Could not process ${failedFiles.length} file(s). They may be corrupted or in an unsupported format. Please check the console for details.`,
          type: 'error',
        });
      }
    },
    [items, onItemsChange]
  );

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileChange(e.dataTransfer.files);
    },
    [handleFileChange]
  );

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
    e.target.value = '';
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id);
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.objectURL);
    }
    onItemsChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}
      >
        <Icon icon="upload" className="w-12 h-12 text-gray-400" />
        <p className="mt-4 text-lg text-gray-600">
          Drag & drop your product images here
        </p>
        <p className="text-sm text-gray-500">or</p>
        <label className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 cursor-pointer">
          Browse Files
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onFileSelect}
          />
        </label>
        <p className="mt-2 text-xs text-gray-400">PNG, JPG, WEBP accepted</p>
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800">
            Uploaded Products ({items.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative group bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col"
              >
                <div className="relative h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                  <div className="absolute top-1 right-1 z-10 flex flex-col gap-1">
                    {item.isGenerated && (
                      <div className="flex items-center gap-1 text-xs text-purple-700 font-semibold py-1 px-2 rounded-full bg-purple-100">
                        <Icon icon="sparkles" className="w-3 h-3" />
                        AI Generated
                      </div>
                    )}
                    {item.enhancement && (
                      <div className="flex items-center gap-1 text-xs text-indigo-700 font-semibold py-1 px-2 rounded-full bg-indigo-100">
                        <Icon icon="sparkles" className="w-3 h-3" />
                        Enhanced
                      </div>
                    )}
                  </div>
                  <img
                    src={item.objectURL}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-2 flex-grow flex flex-col justify-between">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {item.name}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-lg hover:scale-110 z-20"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <Icon icon="trash" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
      />
    </div>
  );
};

export default ImageUploader;
