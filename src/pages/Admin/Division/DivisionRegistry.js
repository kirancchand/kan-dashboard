import React, { lazy } from 'react';
import retry from 'services/retryPromise';
// const Menu = lazy(() => retry(()=>import('./index')));

const ManageState = lazy(() => retry(() => import('./Components/State')));
const ManageDistrict = lazy(() => retry(() => import('./Components/District')));
const ManageRegion = lazy(() => retry(() => import('./Components/Region')));
const ManageArea = lazy(() => retry(() => import('./Components/Area')));
const ManageBranch = lazy(() => retry(() => import('./Components/Branch')));
const ManageCorporation = lazy(() =>
  retry(() => import('./Components/Corporation')),
);
const ManageMuncipality = lazy(() =>
  retry(() => import('./Components/Muncipality')),
);
const ManagePanchayat = lazy(() =>
  retry(() => import('./Components/Panchayat')),
);
const ManageWard = lazy(() => retry(() => import('./Components/Ward')));
const ManageSector = lazy(() => retry(() => import('./Components/Sector')));

const DivisionRegistry = {
  State: ManageState,
  District: ManageDistrict,
  Corporation: ManageCorporation,
  Muncipality: ManageMuncipality,
  Panchayat: ManagePanchayat,
  Ward: ManageWard,
  Sector: ManageSector,
  Region: ManageRegion,
  Area: ManageArea,
  Branch: ManageBranch,
};

export default DivisionRegistry;
