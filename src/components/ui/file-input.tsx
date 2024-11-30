'use client';

import { useRef, useState } from 'react';
import UploaderTwo from '@/components/ui/forms/uploader-two';
import Image from 'next/image';
import { Close } from '../icons/close';

export default function FileInput({
  className,
  label,
  multiple,
  accept,
}: {
  className?: string;
  label?: React.ReactNode;
  multiple?: boolean;
  accept?: any;
}) {
  const multiRef = useRef<HTMLInputElement>(null);
  const [multiImages, setMultiImages] = useState<Array<File>>([]);

  const handleMultiImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const uploadedFiles = (event.target as HTMLInputElement).files;
    const newFiles = Object.entries(uploadedFiles as object)
      .map((file) => {
        if (file[1].type.includes('image')) return file[1];
      })
      .filter((file) => file !== undefined);
    setMultiImages((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleMultiImageDelete = (index: number) => {
    const updatedFiles = multiImages.filter((_, i) => i !== index);
    setMultiImages(updatedFiles);
    (multiRef.current as HTMLInputElement).value = '';
  };
  return (
    <div className={className}>
      <UploaderTwo
        label={label}
        ref={multiRef}
        accept={accept}
        multiple={multiple}
        onChange={handleMultiImageUpload}
      />

      {multiImages.length > 0 && (
        <div className="mt-7 flex flex-row flex-wrap gap-5">
          {multiImages?.map((file: File, index: number) => (
            <div className="relative flex items-center" key={file.name}>
              <figure className="relative mx-auto aspect-square w-20 overflow-hidden rounded-xl border border-gray-300 @2xl:w-32">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw"
                />
              </figure>
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center bg-brand text-white">
                <Close
                  onClick={() => handleMultiImageDelete(index)}
                  className="h-2 w-2 cursor-pointer transition duration-75"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
