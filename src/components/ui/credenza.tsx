'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@hooks/use-media-query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type BaseProps = {
  children: React.ReactNode;
};

type RootCredenzaProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldConfirmClose?: boolean;
  onConfirmedClose?: () => void;
} & BaseProps;

type CredenzaProps = {
  className?: string;
  asChild?: true;
  classNameX?: string;
} & BaseProps;

const desktop = '(min-width: 768px)';

const Credenza = ({
  children,
  shouldConfirmClose,
  onConfirmedClose,
  open,
  onOpenChange,
  ...props
}: RootCredenzaProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const isDesktop = useMediaQuery(desktop);
  const CredenzaComponent = isDesktop ? Dialog : Drawer;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && shouldConfirmClose) {
      setShowConfirmDialog(true);
      return;
    }
    onOpenChange?.(newOpen);
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onConfirmedClose?.();
    onOpenChange?.(false);
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <CredenzaComponent open={open} onOpenChange={handleOpenChange} {...props}>
        {children}
      </CredenzaComponent>

      {showConfirmDialog && (
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Êtes-vous sûr de vouloir fermer ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Les modifications non enregistrées seront perdues.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelClose}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmClose}
                className="text-white"
              >
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <CredenzaTrigger className={className} {...props}>
      {children}
    </CredenzaTrigger>
  );
};

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <CredenzaClose className={className} {...props}>
      {children}
    </CredenzaClose>
  );
};

const CredenzaContent = ({
  className,
  classNameX,
  children,
  ...props
}: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaContent = isDesktop ? DialogContent : DrawerContent;
  const CredenzaTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <CredenzaContent
      className={className}
      classNameX={cn('bg-black rounded-full p-1 text-white', classNameX)}
      onPointerDownOutside={(e) => e.preventDefault()}
      onOpenAutoFocus={(e) => e.preventDefault()}
      {...props}
    >
      <CredenzaTitle className="pointer-events-auto absolute" />
      {children}
    </CredenzaContent>
  );
};

const CredenzaDescription = ({
  className,
  children,
  ...props
}: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <CredenzaDescription className={className} {...props}>
      {children}
    </CredenzaDescription>
  );
};

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <CredenzaHeader className={className} {...props}>
      {children}
    </CredenzaHeader>
  );
};

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <CredenzaTitle className={className} {...props}>
      {children}
    </CredenzaTitle>
  );
};

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn('px-4 md:px-0', className)} {...props}>
      {children}
    </div>
  );
};

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <CredenzaFooter className={className} {...props}>
      {children}
    </CredenzaFooter>
  );
};

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
};
