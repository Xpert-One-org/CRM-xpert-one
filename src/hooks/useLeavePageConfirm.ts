'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const useWarnIfUnsavedChanges = (unsaved: boolean) => {
  const router = useRouter();

  const handleAnchorClick: EventListener = (e: Event) => {
    const event = e as MouseEvent;
    if (event.button !== 0) return; // only handle left-clicks
    const targetUrl = (event.currentTarget as HTMLAnchorElement).href;
    const currentUrl = window.location.href;
    if (targetUrl !== currentUrl && window.onbeforeunload) {
      const res = window.onbeforeunload(event);
      if (!res) event.preventDefault();
    }
  };

  const addAnchorListeners = () => {
    const anchorElements = document.querySelectorAll('a[href]');
    anchorElements.forEach((anchor) =>
      anchor.addEventListener('click', handleAnchorClick)
    );
  };

  useEffect(() => {
    const mutationObserver = new MutationObserver(addAnchorListeners);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    addAnchorListeners();

    return () => {
      mutationObserver.disconnect();
      const anchorElements = document.querySelectorAll('a[href]');
      anchorElements.forEach((anchor) =>
        anchor.removeEventListener('click', handleAnchorClick)
      );
    };
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // required for Chrome
    };

    const handlePopState = (e: PopStateEvent) => {
      if (unsaved) {
        const confirmLeave = window.confirm(
          'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter la page ?'
        );
        if (!confirmLeave) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    if (unsaved) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      window.addEventListener('popstate', handlePopState);
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      window.removeEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [unsaved]);

  useEffect(() => {
    const originalPush = router.push;

    router.push = (url: string, options?: NavigateOptions) => {
      if (unsaved) {
        const confirmLeave = window.confirm(
          'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter la page ?'
        );
        if (confirmLeave) originalPush(url, options);
        else return;
      } else {
        originalPush(url, options);
      }
    };

    return () => {
      router.push = originalPush;
    };
  }, [router, unsaved]);
};
