import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Productos',
    path: '/admin',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Todos', path: '/admin' },
      { title: 'Agregar', path: '/admin/nuevo' }
    ],
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
