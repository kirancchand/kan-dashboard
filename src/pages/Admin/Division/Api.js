import {
  STATE_API,
  DISTRICT_API,
  REGION_API,
  AREA_API,
  BRANCH_API,
  SECTOR_API,
} from '../../services/constants';

export const addState = `${STATE_API}/add`;
export const listState = `${STATE_API}/listState`;

export const listDistrict = `${DISTRICT_API}/listDistrict`;
export const addDistrict = `${DISTRICT_API}/add`;

export const listRegion = `${REGION_API}/listRegion`;
export const addRegion = `${REGION_API}/add`;

export const listArea = `${AREA_API}/listArea`;
export const addArea = `${AREA_API}/add`;

export const listBranch = `${BRANCH_API}/listBranch`;
export const addBranch = `${BRANCH_API}/add`;

export const listSector = `${SECTOR_API}/listSector`;
export const addSector = `${SECTOR_API}/add`;
