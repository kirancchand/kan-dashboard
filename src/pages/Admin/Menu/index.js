/**
 *
 * Menu
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
import makeSelectMenu from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function Menu() {
  useInjectReducer({ key: 'menu', reducer });
  useInjectSaga({ key: 'menu', saga });

  return (
    <div>
      <Helmet>
        <title>Menu</title>
        <meta name="description" content="Description of Menu" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  menu: makeSelectMenu(),
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
)(Menu);
