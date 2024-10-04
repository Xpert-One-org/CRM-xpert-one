import { cn } from '@/lib/utils';

export const Box = ({
  children,
  isSelected,
  className,
  primary,
}: {
  children: React.ReactNode;
  isSelected?: boolean;
  className?: string;
  primary?: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-xs bg-[#E1E1E1] px-2 py-6 text-center text-sm font-medium text-dark transition-colors',
        className,
        { 'bg-background': isSelected },
        { 'bg-primary': primary }
      )}
    >
      {children}
    </div>
  );
};
