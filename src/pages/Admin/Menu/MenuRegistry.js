import React, { lazy } from 'react';
import retry from 'services/retryPromise';
const ManageMenu = lazy(() => retry(() => import('./Components/Menu')));
const ManageRole = lazy(() => retry(() => import('./Components/Role')));
const ManageRoleMenu = lazy(() => retry(() => import('./Components/RoleMenu')));
const MenuRegistry = {
  Menu: ManageMenu,
  Role: ManageRole,
  RoleMenu: ManageRoleMenu,
};

export default MenuRegistry;
