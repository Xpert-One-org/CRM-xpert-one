'use client';

import SearchWBg from '@/components/svg/SearchWBg';
import Upload from '@/components/svg/Upload';
import { cn } from '@/utils/functions/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Eye } from 'lucide-react';
import type { ComponentProps} from 'react';
import React, { useState } from 'react';

type Props = {
  label?: string | React.ReactNode;
} & ComponentProps<'input'>

export default function SeeFileInput({
  className,
  placeholder,
  label,
  children,
  ...props
}: Props) {
  const file = null;
  return (
    <div className="w-full xl:max-w-[280px]">
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium text-colors-black"
        >
          {label}
        </label>
      )}
      <label
        className={cn(
          'flex h-[42px] min-w-[165px] items-center rounded-xs border-[1px] border-colors-border-gray bg-white',
          className
        )}
      >
        {file ? (
          <>
            <a
              target="_blank"
              href={file ? URL.createObjectURL(file) : ''}
              className="w-full bg-transparent px-spaceMediumContainer text-sm font-light outline-none placeholder:text-sm"
            >
              {file ? '' : 'Aucun fichier sélectionné'}
            </a>

            {/*  Download the file */}
            <a
              target="_blank"
              href={file ? URL.createObjectURL(file) : ''}
              className="m-[7px] rounded-xxs bg-colors-lightgray-secondary p-1 outline-none"
            >
              <Eye className="" strokeWidth={1} size={20} />
            </a>
          </>
        ) : (
          <>
            <p className="w-full truncate bg-transparent px-spaceMediumContainer text-sm font-light outline-none placeholder:text-sm">
              Aucun fichier renseigné
            </p>
            <div className="m-[7px] rounded-xxs bg-colors-lightgray-secondary p-1 outline-none">
              <Eye className="" strokeWidth={1} size={20} />
            </div>
          </>
        )}
      </label>
    </div>
  );
}
