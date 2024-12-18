import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import React from 'react';

export default function EtatFacturationUploadRow() {
  return (
    <>
      <div className="col-span-5" />
      <Button className="h-spaceLarge w-full">
        <DownloadIcon className="size-6 -rotate-90 text-white" />
      </Button>
      <div className="col-span-2" />
      <Button className="h-spaceLarge w-full">
        <DownloadIcon className="size-6 -rotate-90 text-white" />
      </Button>
    </>
  );
}
