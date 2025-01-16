'use client';

import React, { useEffect, useState } from 'react';
import BubbleNotif from './svg/BubbleNotif';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import useNotifications from '@/hooks/useNotifications';
import type { DBNotification } from '@/types/typesDb';
import Bell from './svg/Bell';
import useUser from '@/store/useUser';
import { Button } from './ui/button';
import { AlertTriangle, Check, Info } from 'lucide-react';
import InfiniteScroll from './ui/infinite-scroll';
import Loader from './Loader';

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const pathname = usePathname();

  const {
    fetchNotifications,
    notifications,
    totalNotifications,
    setNotifications,
    loading,
    removeNotification,
  } = useNotifications();
  const supabase = createSupabaseFrontendClient();
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification',
          filter: `userId=eq.${user?.id}`,
        },
        (payload) => {
          const newNotifications = notifications
            ? [...notifications, payload.new as DBNotification]
            : [payload.new as DBNotification];
          setNotifications(newNotifications);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const StatusIcon = ({ status }: { status: DBNotification['status'] }) => {
    switch (status) {
      case 'info':
        return <Info className="size-4 text-primary" />;
      case 'urgent':
        return <AlertTriangle className="size-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleCheckClick = async (
    e: React.MouseEvent,
    notificationId: number
  ) => {
    e.preventDefault();

    setDeletingIds((prev) => [...prev, notificationId]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // const newNotifications = notifications ? notifications.filter(notif => notif.id !== notificationId) : []
    // setNotifications(newNotifications)

    removeNotification(notificationId);
    setDeletingIds((prev) => prev.filter((id) => id !== notificationId));
  };

  const hasMore =
    notifications && totalNotifications
      ? notifications.length < totalNotifications
      : totalNotifications === 0
        ? false
        : true;

  return (
    <div className="relative">
      <Button
        onClick={togglePopup}
        variant="outline"
        size="icon"
        className="relative rounded-full"
      >
        <Bell className="size-4" />
        {notifications && notifications.length > 0 && (
          <span className="absolute right-0 top-0 flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-orange-500"></span>
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10 bg-black/50"
            onClick={togglePopup}
          ></div>
          <div className="absolute -right-10 top-12 z-50 w-80 rounded-md md:w-[50vw] md:max-w-[600px]">
            <div className="absolute inset-0 z-[-1]">
              <BubbleNotif className="size-full" />
            </div>
            <div className="px-4 pb-4 pt-8">
              <h3 className="mb-2 pb-2 text-sm font-semibold">Notifications</h3>
              {notifications && notifications.length > 0 ? (
                <ul className="max-h-[500px] space-y-2 overflow-y-auto pb-4">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`group rounded-md bg-gray-50 transition-all duration-500 ease-in-out hover:bg-gray-100 ${deletingIds.includes(notification.id) ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'} `}
                    >
                      <div className="flex items-center justify-between p-2">
                        <Link
                          href={`/${notification.link}`}
                          className="grow pr-4"
                        >
                          <div className="flex items-center space-x-2">
                            <StatusIcon status={notification.status} />
                            <div>
                              <h4 className="text-sm font-medium">
                                {notification.subject}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="accent"
                          size="icon"
                          className={`size-8 min-w-8 rounded-lg text-white transition-all duration-300 ${deletingIds.includes(notification.id) ? 'rotate-12 scale-90 opacity-100' : 'opacity-0 group-hover:opacity-100'} ${
                            notification.status === 'urgent'
                              ? 'bg-red-500 hover:bg-red-600'
                              : notification.status === 'info'
                                ? 'bg-primary hover:bg-secondary'
                                : ''
                          } `}
                          onClick={(e) => handleCheckClick(e, notification.id)}
                          disabled={deletingIds.includes(notification.id)}
                        >
                          <Check className="size-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                  <InfiniteScroll
                    hasMore={hasMore}
                    next={fetchNotifications}
                    isLoading={false}
                  >
                    {hasMore && (
                      <div className="mt-4 flex w-full items-center justify-center">
                        <Loader />
                      </div>
                    )}
                    {!hasMore && loading && (
                      <div className="mt-4 flex w-full items-center justify-center">
                        <Loader />
                      </div>
                    )}
                    {!loading && notifications?.length === 0 && (
                      <div className="mt-4 flex w-full items-center justify-center">
                        <p className="text-gray-secondary text-center text-sm">
                          Aucun résultat
                        </p>
                      </div>
                    )}
                  </InfiniteScroll>
                </ul>
              ) : (
                <p className="text-xs text-gray-500">
                  Pas de nouvelle notification
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;
