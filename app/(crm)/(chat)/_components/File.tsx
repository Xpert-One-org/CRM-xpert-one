'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import Loader from '@/components/Loader';
import { DialogTitle } from '@radix-ui/react-dialog';

type Props = {
  file: {
    name: string | null;
    type: string | null;
    url: string | null;
  } | null;
};

export default function File({ file }: Props) {
  const [isFileLoading, setIsFileLoading] = useState(true);
  const [isZoomedImgLoading, setIsZoomedImgLoading] = useState(true);
  return file?.type?.includes('image') ? (
    <Dialog key={file.url}>
      <DialogTrigger>
        <div className="relative flex h-[100px] items-center">
          {isFileLoading && (
            <div className="absolute flex size-full items-center justify-center rounded-lg border bg-fond-gray">
              <Loader />{' '}
            </div>
          )}
          <Image
            src={file.url ?? ''}
            alt="image"
            width={80}
            height={80}
            className="max-h-[100px] rounded-lg object-contain"
            onLoadingComplete={() => setIsFileLoading(false)}
            onError={() => setIsFileLoading(false)}
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className="flex w-fit max-w-full items-center justify-center border-0 bg-transparent"
        classNameX=" text-white top-0 right-0 hidden"
      >
        <DialogTitle />
        {isZoomedImgLoading && (
          <div className="absolute flex w-full items-center justify-center">
            <Loader />
          </div>
        )}
        <Image
          src={file.url ?? ''}
          alt="image"
          width={800}
          height={800}
          onLoadingComplete={() => setIsZoomedImgLoading(false)}
          onError={() => setIsZoomedImgLoading(false)}
        />
      </DialogContent>
    </Dialog>
  ) : (
    file?.url && (
      <Link
        href={file.url ?? ''}
        key={file.url}
        target="blank"
        className="flex h-full w-[100px] flex-col items-center"
      >
        <FileText strokeWidth={1} size={58} />
        <p className="truncate pt-2 text-xxs font-light">{file.name}</p>
      </Link>
    )
  );
}
