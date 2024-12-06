'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

export const Box = ({
  children,
  isSelected,
  className,
  primary,
  onClick,
  isSelectable,
  options,
  onValueChange,
  collapsible,
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
  collapsible?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCollapsibleClick = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderContent = () => {
    if (isSelectable) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-full items-center justify-center gap-2 hover:cursor-pointer">
              {children} <ChevronDownIcon className="size-4 stroke-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {options && options.length > 0 ? (
              options.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onValueChange?.(option.value ?? '')}
                >
                  {option.label}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>Aucun résultat</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (collapsible) {
      return (
        <div
          className="flex w-full cursor-pointer items-center justify-between gap-2"
          onClick={handleCollapsibleClick}
        >
          <div className="flex flex-col items-start justify-start text-start">
            {isExpanded
              ? children
              : Array.isArray(children)
                ? children[0]
                : children}
          </div>
          {isExpanded ? (
            <div>
              <ChevronUpIcon className="size-4 stroke-2" />
            </div>
          ) : (
            <div>
              <ChevronDownIcon className="size-4 stroke-2" />
            </div>
          )}
        </div>
      );
    }

    return children;
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap text-wrap rounded-xs bg-[#E1E1E1] px-2 py-3 text-center text-sm font-medium text-dark transition',
        className,
        { 'bg-background font-bold': isSelected },
        { 'bg-primary': primary }
      )}
      onClick={onClick}
    >
      {renderContent()}
    </div>
  );
};
