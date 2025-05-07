'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';

type Props = {
  file: {
    name: string | null;
    type: string | null;
    url: string | null;
  } | null;
}

export default function File({ file }: Props) {
  const [isFileLoading, setIsFileLoading] = useState(true);
  const [isZoomedImgLoading, setIsZoomedImgLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isZoomedVideoLoading, setIsZoomedVideoLoading] = useState(true);

  if (file?.type?.includes('image')) {
    return (
      <Dialog key={file.url}>
        <DialogTrigger>
          <div className="relative flex h-[140px] items-center">
            {isFileLoading && (
              <div className="bg-colors-fond-gray absolute flex size-full items-center justify-center rounded-lg border">
                <Loader />{' '}
              </div>
            )}
            <Image
              src={file?.url ?? ''}
              alt="image"
              width={140}
              height={140}
              className="max-h-[140px] rounded-lg object-contain"
              onLoadingComplete={() => setIsFileLoading(false)}
              onError={() => setIsFileLoading(false)}
            />
          </div>
        </DialogTrigger>
        <DialogContent
          className="flex w-fit max-w-full items-center justify-center border-0 bg-transparent"
          classNameX=" text-white top-0 right-0 hidden"
        >
          <DialogTitle className="absolute" />
          {isZoomedImgLoading && (
            <div className="absolute flex w-full items-center justify-center">
              <Loader />
            </div>
          )}
          <Image
            src={file?.url ?? ''}
            alt="image"
            width={800}
            height={800}
            onLoadingComplete={() => setIsZoomedImgLoading(false)}
            onError={() => setIsZoomedImgLoading(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (file?.type?.includes('video')) {
    return (
      <Dialog key={file.url}>
        <DialogTrigger>
          <div className="relative flex h-[140px] cursor-pointer items-center">
            {isVideoLoading && (
              <div className="bg-colors-fond-gray absolute flex size-full items-center justify-center rounded-lg border">
                <Loader />
              </div>
            )}
            <video
              src={file?.url ?? ''}
              width={140}
              height={140}
              className="pointer-events-none max-h-[140px] rounded-lg object-contain"
              controls
              onLoadedData={() => setIsVideoLoading(false)}
              onError={() => setIsVideoLoading(false)}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.4)" />
                <polygon points="20,16 34,24 20,32" fill="white" />
              </svg>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent
          className="flex w-fit max-w-full items-center justify-center border-0 bg-transparent"
          classNameX=" text-white top-0 right-0 hidden"
        >
          <DialogTitle className="absolute" />
          {isZoomedVideoLoading && (
            <div className="absolute flex w-full items-center justify-center">
              <Loader />
            </div>
          )}
          <video
            src={file?.url ?? ''}
            width={800}
            height={800}
            controls
            onLoadedData={() => setIsZoomedVideoLoading(false)}
            onError={() => setIsZoomedVideoLoading(false)}
            className="rounded-lg"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    file?.url && (
      <Link
        href={file.url ?? ''}
        key={file.url}
        target="blank"
        className="flex h-full w-[100px] flex-col items-center"
      >
        <FileText strokeWidth={1} size={58} />
        <p className="truncate pt-2 text-xxs font-light">
          {file?.name}
        </p>
      </Link>
    )
  );
}
