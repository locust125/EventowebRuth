import CogIcon from '@heroicons/react/24/solid/CogIcon';
import BuildingLibraryIcon from '@heroicons/react/24/solid/BuildingLibraryIcon';
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Agregar evento',
    path: '/agregarEvento',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'gestion',
    path: '/gestion',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },

];
