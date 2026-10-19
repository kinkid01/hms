import { Icon } from '@chakra-ui/react';
import {
  MdAccountBalanceWallet,
  MdCalendarMonth,
  MdDashboard,
  MdFolderShared,
  MdNotificationsNone,
  MdPerson,
  MdReceiptLong,
  MdSettings,
} from 'react-icons/md';
import { IRoute } from 'types/navigation';

const icon = (as: any) => <Icon as={as} width="20px" height="20px" color="inherit" />;

// Patient portal navigation (PRD §22).
const routes: IRoute[] = [
  { name: 'Dashboard', layout: '/portal', path: '/dashboard', icon: icon(MdDashboard) },
  { name: 'Medical Records', layout: '/portal', path: '/medical-records', icon: icon(MdFolderShared) },
  { name: 'Appointments', layout: '/portal', path: '/appointments', icon: icon(MdCalendarMonth) },
  { name: 'Wallet', layout: '/portal', path: '/wallet', icon: icon(MdAccountBalanceWallet) },
  { name: 'Transaction History', layout: '/portal', path: '/wallet/transactions', icon: icon(MdReceiptLong) },
  { name: 'Profile', layout: '/portal', path: '/profile', icon: icon(MdPerson) },
  { name: 'Notifications', layout: '/portal', path: '/notifications', icon: icon(MdNotificationsNone) },
  { name: 'Settings', layout: '/portal', path: '/settings', icon: icon(MdSettings) },
];

// Pages that aren't in the sidebar but still need a navbar title.
export const hiddenRoutes: IRoute[] = [
  { name: 'Fund Wallet', layout: '/portal', path: '/wallet/fund', icon: '' },
  { name: 'Visit Details', layout: '/portal', path: '/medical-records/', icon: '' },
];

export default routes;
