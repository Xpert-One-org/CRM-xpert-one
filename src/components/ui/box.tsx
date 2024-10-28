'use client';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ChevronDownIcon } from 'lucide-react';

export const Box = ({
  children,
  isSelected,
  className,
  primary,
  onClick,
  isSelectable,
  options,
  onValueChange,
}: {
  children: React.ReactNode;
  isSelected?: boolean;
  className?: string;
  primary?: boolean;
  onClick?: () => void;
  isSelectable?: boolean;
  options?: {
    label: string | null;
    value: string | null;
  }[];
  onValueChange?: (value: string) => void;
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap text-wrap rounded-xs bg-[#E1E1E1] px-2 py-3 text-center text-sm font-medium text-dark transition',
        className,
        { 'bg-background font-bold text-red-600': isSelected },
        { 'bg-primary': primary }
      )}
      onClick={onClick}
    >
      {isSelectable ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="flex w-full items-center justify-center gap-2 hover:cursor-pointer"
              onClick={onClick}
            >
              {children} <ChevronDownIcon className="size-4 stroke-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {options && options.length > 0 ? (
              options.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    if (onValueChange) {
                      onValueChange(option.value ?? '');
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>Aucun résultat</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        children
      )}
    </div>
  );
};
