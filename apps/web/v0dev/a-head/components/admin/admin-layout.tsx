'use client';

import {
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  SearchIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { getWebSocketService } from '../../services/websocket-service';
import RealTimeStatus from './real-time-status';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout({ children }: any) {
  const { data: session } = useSession();

  // Initialize WebSocket connection
  useEffect(() => {
    const wsService = getWebSocketService();
    wsService.connect().catch(console.error);

    return () => {
      wsService.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Static sidebar for desktop */}
      <div className="hidden bg-gray-800 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-grow flex-col overflow-y-auto bg-gray-800 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Link href="/">
              <a className="text-2xl font-bold text-white">Admin</a>
            </Link>
          </div>
          <div className="mt-6 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 bg-gray-800 px-2" aria-label="Sidebar">
              <Link href="/admin">
                <a
                  className={classNames(
                    'bg-gray-900 text-white',
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                  )}
                >
                  <ViewGridIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-gray-300"
                    aria-hidden="true"
                  />
                  Dashboard
                </a>
              </Link>

              <Link href="/admin/users">
                <a
                  className={classNames(
                    'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                  )}
                >
                  <OutlinePersonIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  Users
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      {/* Main column */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Search header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <form className="flex w-full md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <RealTimeStatus className="mr-4" />
              <button
                type="button"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={
                        session?.user?.image ||
                        'https://images.unsplash.com/photo-1472099645785-5658abf49a45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                      }
                      alt=""
                    />
                  </button>
                </div>

                {/*
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          */}
                {/* <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-0">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sign out</a>
                </div> */}
                <button
                  onClick={() => signOut()}
                  className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              {children}
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
