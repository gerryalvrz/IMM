'use client';

import { ForwardedRef, forwardRef } from 'react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import cn from '@/utils/cn';
import UploadIcon from '@/components/icons/upload';
import Button from '@/components/ui/button';

const acceptedFileType = {
  img: 'image/*',
  pdf: 'application/pdf',
  csv: 'text/csv',
  imgAndPdf: 'image/*,application/pdf',
  all: 'image/*,application/pdf,text/csv,application/gzip,application/xml,application/zip,application/msword,text/plain',
};

export interface UploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'accept' | 'children'
  > {
  /** Specify type of the files */
  accept: 'img' | 'pdf' | 'csv' | 'imgAndPdf' | 'all';
  /** Pass multiple files */
  multiple?: boolean;
  /** Whether disable upload */
  disabled?: boolean;
  /** Pass children to customize file item style */
  children?: React.ReactNode;
  /** Pass field label */
  label?: React.ReactNode;
  /** Set your custom text to show in upload field */
  placeholderText?: React.ReactNode;
  /** To pass getRootProps of react-dropzone */
  dropzoneRootProps?: DropzoneRootProps;
  /** To pass getInputProps of react-dropzone */
  dropzoneInputProps?: DropzoneInputProps;
  /** Pass wrapperClassName to style the container */
  wrapperClassName?: string;
  /** Pass className to style the container */
  className?: string;
  /** Pass iconClassName to style the upload icon */
  iconClassName?: string;
  /** Pass label className to style label */
  labelClassName?: string;
}

/** Upload component allows user to upload files either from file explorer or by dragging and dropping.
 * Here is the API documentation of Upload component. Rest of the props are same as html input field.
 * You can use props like `disabled`, `multiple`, `capture` etc.
 */

// const Upload = forwardRef<HTMLInputElement, UploadProps>(

function Upload(
  {
    accept,
    children,
    label,
    dropzoneRootProps,
    dropzoneInputProps,
    placeholderText,
    className,
    wrapperClassName,
    iconClassName = '@3xl:w-44 @3xl:h-44 w-28 shrink-0 @2xl:w-36',
    labelClassName,
    ...props
  }: React.PropsWithChildren<UploadProps>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  // console.log('accept', accept);
  return (
    <div
      className={cn(
        'rounded-lg border border-solid border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-light-dark sm:p-6',
        wrapperClassName,
      )}
    >
      <div
        className="relative flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-200 dark:border-gray-700"
        {...dropzoneRootProps}
      >
        <input
          ref={ref}
          title=""
          type="file"
          accept={acceptedFileType[accept]}
          className="absolute top-0 z-10 h-full w-full opacity-0 disabled:cursor-not-allowed"
          {...props}
          {...dropzoneInputProps}
        />
        {placeholderText || (
          <div className="text-center">
            <p className="mb-6 text-sm tracking-tighter text-gray-600 dark:text-gray-400">
              {placeholderText || 'PNG, GIF, WEBP, MP4 or MP3. Max 100mb.'}
            </p>
            <Button>CHOOSE FILE</Button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export default forwardRef(Upload);
Upload.displayName = 'Upload';

// Upload.displayName = 'Upload';
// export default Upload;
