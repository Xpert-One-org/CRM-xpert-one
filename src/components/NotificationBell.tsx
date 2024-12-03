'use client';
import React, { useEffect, useState } from 'react';
import BubbleNotif from './svg/BubbleNotif';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

import useNotifications from '@/hooks/useNotifications';
import type { DBNotification } from '@/types/typesDb';
import Bell from './svg/Bell';

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { chatNotifications } = useNotifications();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  const handleUnreadChatClick = async () => {
    const supabase = createSupabaseFrontendClient();
    const { user } = (await supabase.auth.getUser()).data;

    if (!user) {
      console.error('User not found');
      return;
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={togglePopup}
        className="relative z-20 focus:outline-none"
      >
        <div className="relative rounded-full border border-border-gray bg-white p-2">
          <Bell />
          {chatNotifications && chatNotifications.length > 0 && (
            <>
              <div className="absolute right-[10px] top-[9px] z-20 flex size-2 items-center justify-center rounded-full border-2 border-transparent bg-white font-bold text-white group-hover:scale-110"></div>
              <div className="absolute right-[10px] top-[9px] z-20 flex size-2 animate-pulse items-center justify-center rounded-full border-2 border-transparent bg-[#FFA800] font-bold text-white group-hover:scale-110"></div>
            </>
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={togglePopup}
          ></div>
          <div className="absolute -right-2 top-12 z-50 min-h-[350px] w-[80vw] animate-in sm:-right-3 sm:w-[60vw] md:-right-6 lg:-right-12 xl:w-[50vw] 2xl:w-[30vw]">
            <div className="absolute inset-0 z-[-1]">
              <BubbleNotif className="size-full" />
            </div>

            <div className="relative z-10 mt-5 py-6">
              <h3 className="mb-2 px-7 text-sm font-semibold">Notifications</h3>
              {chatNotifications && chatNotifications.length > 0 ? (
                <ul>
                  {chatNotifications.map((notification: DBNotification) => (
                    <Link
                      href={`/messagerie`}
                      passHref
                      onClick={() => handleUnreadChatClick()}
                      className="group"
                      key={notification.id}
                    >
                      <li
                        key={notification.id}
                        className={
                          'w-[99.1%] translate-x-[0.3%] px-7 py-6 group-hover:bg-lightgray-secondary'
                        }
                      >
                        <div>
                          <div className="flex justify-between">
                            <h3 className="font-bold">
                              {/* Nouveau message de {notification.chat.messages}{" "} */}
                              {/* {notification.message.user?.lastname} */}
                            </h3>
                            <div className="relative h-full">
                              <div className="absolute z-20 mt-spaceXSmall flex size-2 items-center justify-center rounded-full border-2 border-transparent bg-white font-bold text-white group-hover:scale-110"></div>
                              <div className="absolute z-20 mt-spaceXSmall flex size-2 animate-pulse items-center justify-center rounded-full border-2 border-transparent bg-[#FFA800] font-bold text-white group-hover:scale-110"></div>
                            </div>
                          </div>
                          <p className="mt-1 text-sm font-light">
                            {/* {notification.message.content} */}
                          </p>
                        </div>
                      </li>
                      <div className="m-auto block h-px w-[93%] bg-light-gray-third" />
                    </Link>
                  ))}
                </ul>
              ) : (
                <p className="px-7 text-xs text-gray-500">
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
