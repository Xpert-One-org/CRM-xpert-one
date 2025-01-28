import * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { Info } from 'lucide-react';

type InfoCircleProps = {
  title: string;
} & React.HTMLAttributes<HTMLDivElement>

export function InfoCircle({ title, className, ...props }: InfoCircleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className} {...props}>
            <Info className="size-4 text-primary" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
