/**
 *
 * Division
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectDivision from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function Division() {
  useInjectReducer({ key: 'division', reducer });
  useInjectSaga({ key: 'division', saga });

  return (
    <div>
      <Helmet>
        <title>Division</title>
        <meta name="description" content="Description of Division" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Division.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  division: makeSelectDivision(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Division);
