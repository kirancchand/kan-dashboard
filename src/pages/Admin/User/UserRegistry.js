import React, { lazy } from 'react';
import retry from 'services/retryPromise';
const User = lazy(() => retry(() => import('./Components/User')));
const UserRole = lazy(() => retry(() => import('./Components/UserRole')));
const UserRegistry = {
  User,
  UserRole,
};

export default UserRegistry;
