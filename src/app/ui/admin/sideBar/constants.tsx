import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Productos',
    path: '/',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Notificaciones',
    path: '/notifications',
    icon: <Icon icon="lucide:mail" width="24" height="24" />,
  },
  {
    title: 'config',
    path: '/settings',
    icon: <Icon icon="lucide:settings" width="24" height="24" />
  }
];
