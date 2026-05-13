import React, { useState, useEffect, Fragment, Suspense } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Loader from 'react-loaders';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  Label,
  FormFeedback,
  CardFooter,
} from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import PageTitle from '../../Layout/AppPageTitle';
import RemotePagination from '../../../components/Common/ReactDatatableNext/BootstrapTableNext.js';
import ListState from './List/ListState';
import http from '../../../services/http';
import { addState, listState } from '../Api';
export default function ManageState() {
  const [loading, setLoading] = useState(false);
  const initialValue = {
    state: '',
  };

  async function addNewState(data) {
    console.log('data', data);
    setLoading(true);
    await http({
      method: 'POST',
      url: addState,
      data,
    })
      .then(function(response) {
        if (response.status === 200) {
          console.log(response.data);

          toast(response.data.message, {
            position: 'top-right',
            type: 'success',
          });
        } else {
          toast('Failed to Add State', {
            position: 'top-right',
            type: 'error',
          });
        }
        setLoading(false);
      })
      .catch(err => {
        toast(err, { position: 'top-right', type: 'error' });
        setLoading(false);
      });
  }

  const handleSubmit = (values, { resetForm }) => {
    addNewState(values);
    resetForm();
    // setData([...data,values])
  };

  const handleFunc = () => {};
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
              heading="Division Management"
              subheading="State"
              icon="pe-7s-news-paper icon-gradient bg-deep-blue"
              content="Division Management"
              activeContent="State"
            />
            <Formik
              initialValues={initialValue}
              //  validationSchema={firContentValidateSchema}
              onSubmit={handleSubmit}
            >
              {({
                errors,
                touched,
                isSubmitting,
                dirty,
                resetForm,
                values,
                setFieldValue,
                setFieldTouched,
              }) => (
                <Form>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Field
                          type="text"
                          name="state"
                          id="state"
                          value={values.state}
                          placeholder="state"
                          as={Input}
                          invalid={errors.state && touched.state}
                          autoComplete="off"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <Button type="submit" color="primary">
                        Save
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      {!loading && (
                        <ListState handleFunc={handleFunc} loading={loading} />
                      )}
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </ReactCSSTransitionGroup>
        </Suspense>
      </BlockUi>
    </Fragment>
  );
}
