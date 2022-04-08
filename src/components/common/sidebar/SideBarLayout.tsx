import {
  ReactNode, useCallback, useState,
} from 'react';
import { CUSTOMER_ACTIONS, ADMIN_ACTIONS } from 'components/common/sidebar/constant';
import { AuthService } from '../../../services';
import { useMediaBreakpoints, useLogout } from '../../../hooks';
import { SideBarDesktop } from './desktop';
import { SideBarMobile } from './mobile/SidebarMobile';

interface Props {
  children: ReactNode;
}

export const SideBarLayout = ({ children }: Props) => {
  const { isMobile } = useMediaBreakpoints();
  const isAdmin = AuthService.isAdmin();
  const ACTIONS = isAdmin ? ADMIN_ACTIONS : CUSTOMER_ACTIONS;
  const { logout } = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDrawerOpen = () => {
    setSidebarOpen(true);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  // useCallback to cache the component
  // it will generate new component whenever Sidebar rerender
  // which affect performance
  const Component = useCallback((props) => (isMobile ? (
    <SideBarMobile {...props} />
  ) : (
    <SideBarDesktop
      {...props}
      sidebarOpen={sidebarOpen}
      handleDrawerOpen={handleDrawerOpen}
      handleDrawerClose={handleDrawerClose}
    />
  )), [isMobile, sidebarOpen]);

  return (
    <Component
      actions={ACTIONS}
      logoutUser={logout}
    >
      {children}
    </Component>
  );
};
