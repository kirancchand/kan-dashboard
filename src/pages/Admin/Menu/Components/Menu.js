import React, { useState, Fragment, Suspense } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Loader from 'react-loaders';
import { Row, Col, FormGroup, Input, Button } from 'reactstrap';
import { Formik, Field, Form } from 'formik';
import PageTitle from '../../Layout/AppPageTitle';
import ListMenu from './List/ListMenu';
import useModal from '../../../components/UseModal/useModal';
import MenuModal from './Common/MenuModal';
export default function ManageMenu() {
  const [loading, setLoading] = useState(false);
  const { toggle, isShowing } = useModal();
  const addMenuFunc = () => {
    toggle();
  };

  const handleFunc = () => {};

  const returnFunc = () => {};
  return (
    <Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        loader={<Loader active type="ball-spin-fade-loader" />}
      >
        <Suspense fallback={<Loader type="ball-pulse-rise" />}>
          <ReactCSSTransitionGroup
            component="div"
            transitionAppear
            transitionName="MainAnimation"
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
          >
            <PageTitle
              heading="Menu Management"
              subheading="Menu"
              icon="pe-7s-news-paper icon-gradient bg-deep-blue"
              content="Menu Management"
              activeContent="Menu"
            />
            <Row>
              <Col md="12">
                <Button className="primary" onClick={() => addMenuFunc()}>
                  Add Menu
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                {!loading && (
                  <ListMenu handleFunc={handleFunc} loading={loading} />
                )}
              </Col>
            </Row>

            <MenuModal
              isShowing={isShowing}
              hide={toggle}
              name="Menu"
              style={{ maxWidth: '50%', height: 'auto' }}
              returnFunc={returnFunc}
              loading={loading}
              setLoading={setLoading}
            />
          </ReactCSSTransitionGroup>
        </Suspense>
      </BlockUi>
    </Fragment>
  );
}
