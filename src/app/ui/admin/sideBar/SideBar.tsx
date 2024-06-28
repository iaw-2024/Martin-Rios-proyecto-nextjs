'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDENAV_ITEMS } from './constants';
import { SideNavItem } from './types';
import { Icon } from '@iconify/react';

import { signOut } from "next-auth/react"
import { Button } from '@headlessui/react';

const SideNav = () => {
  return (
    <div className="md:w-60 bg-gray-900 text-white h-screen flex-1 fixed border-r border-gray-700 hidden md:flex">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col space-y-6 w-full">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-gray-700 h-12 w-full"
          >
            <span className="h-7 w-7 bg-gray-800 rounded-lg" />
            <span className="font-bold text-xl hidden md:flex">Logo</span>
          </Link>

          <div className="flex flex-col space-y-2 md:px-6">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
          
        </div>
        <Button 
        onClick={()=>{
          signOut()
        }}
        className="flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-gray-800 mb-4">
            < Icon icon="lucide:log-out" width="24" height="24" />
            <span className="font-semibold text-xl flex">Cerrar sesión</span>
        </Button>
    </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg hover:bg-gray-800 w-full justify-between ${
              pathname.includes(item.path) ? 'bg-gray-800' : ''
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? 'font-bold' : ''
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-gray-800 ${
            item.path === pathname ? 'bg-gray-800' : ''
          }`}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
