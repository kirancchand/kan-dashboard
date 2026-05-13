import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the division state domain
 */

const selectDivisionDomain = state => state.division || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Division
 */

const makeSelectDivision = () =>
  createSelector(
    selectDivisionDomain,
    substate => substate,
  );

export default makeSelectDivision;
export { selectDivisionDomain };
