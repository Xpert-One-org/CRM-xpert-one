'use client';

import Upload from '@/components/svg/Upload';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  label?: string | React.ReactNode;
} & ComponentProps<'input'>;

export default function DownloadInput({
  className,
  placeholder = 'CV.png',
  label,
  children,
  ...props
}: Props) {
  // const file = new File(["foo"], "foo.txt", {
  //   type: "text/plain",
  // });
  const file = null;
  return (
    <div className="w-full xl:max-w-[280px]">
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium text-black">
          {label}
        </label>
      )}
      <label
        className={cn(
          'flex h-[42px] min-w-[165px] items-center rounded-xs border-[1px] border-border-gray bg-white',
          className
        )}
      >
        {file ? (
          <>
            <a
              href={file ? URL.createObjectURL(file) : ''}
              download={''}
              className="w-full truncate bg-transparent px-spaceMediumContainer text-sm font-light outline-none placeholder:text-sm"
            >
              {placeholder}
            </a>

            {/*  Download the file */}
            <a
              href={file ? URL.createObjectURL(file) : ''}
              download={''}
              className="m-[7px] rounded-xxs bg-lightgray-secondary p-1 outline-none"
            >
              <Upload className="" />
            </a>
          </>
        ) : (
          <>
            <p className="w-full truncate bg-transparent px-spaceMediumContainer text-sm font-light outline-none placeholder:text-sm">
              Aucun fichier renseigné
            </p>
            <div className="m-[7px] rounded-xxs bg-lightgray-secondary p-1 outline-none">
              <Upload className="" />
            </div>
          </>
        )}
      </label>
    </div>
  );
}
