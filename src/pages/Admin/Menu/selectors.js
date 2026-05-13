import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the menu state domain
 */

const selectMenuDomain = state => state.menu || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Menu
 */

const makeSelectMenu = () =>
  createSelector(
    selectMenuDomain,
    substate => substate,
  );

export default makeSelectMenu;
export { selectMenuDomain };
