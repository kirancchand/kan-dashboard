import React, { useState, Fragment, Suspense, useEffect } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Loader from 'react-loaders';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  InputGroup,
  Label,
} from 'reactstrap';
import { Formik, Field, Form } from 'formik';
import { toast } from 'react-toastify';
import PageTitle from '../../Layout/AppPageTitle';
import ListUserRole from './List/ListUserRole'
import useModal from '../../../components/UseModal/useModal';
import RSelect from '../../../components/RSelect/RSelect';
import RSelectMulti from '../../../components/RSelectMulti/RSelectMulti';
import http from 'services/http';
import md from 'services/masterData';
export default function UserRole() {
  const [loading, setLoading] = useState(false);
  const { toggle, isShowing } = useModal();
  const addUserFunc = () => {
    toggle();
  };
  const [selData, setSelData] = useState(null);
  const [roleData, setRoleData] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    async function getRole() {
      setRoleLoading(true);
      md('getAll_Role')
        .then(r => {
          setRoleData(r);
          setRoleLoading(false);
        })
        .catch(error => {
          toast(error, { position: 'top-right', type: 'error' });
          setRoleLoading(false);
        });
    }
    getRole();
  }, []);

  const handleFunc = rowData => {
    console.log(rowData);
    setSelData(rowData);
  };

  const returnFunc = () => {};

  const roleFunc = (value, setFieldValue) => {
    setFieldValue('role', value);
  };

  const handleSubmit = (values, { resetForm }) => {
    addNewRoleMenu(values);
    resetForm();
  };
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
              heading="User Management"
              subheading="User Role"
              icon="pe-7s-news-paper icon-gradient bg-deep-blue"
              content="User Management"
              activeContent="UserRole"
            />
            <Row>
              <Col md="12">
                <Formik
                  initialValues={{
                    user_id:"",
                    role:[]
                  }}
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
                        <Col md="5">
                          <FormGroup>
                            <Label>Selected User:{selData!=null?selData.first_name:"No User Selected"}</Label>
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col md="5">
                          <FormGroup>
                            <Field
                              component={RSelectMulti}
                              name="role"
                              id="role"
                              value={values.role}
                              onChange={ev => roleFunc(ev, setFieldValue)}
                              options={roleData}
                              placeholder="--Select Role--"
                              error={errors.role}
                              touched={touched.role}
                              isLoading={roleLoading}
                              isClearable
                            />
                          </FormGroup>
                        </Col>
                        <Col md="2">
                          <Button type="submit" color="primary">Save</Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
            <Row>
              <Col md="12">                        
                {!loading&&<ListUserRole handleFunc={(rowData)=>handleFunc(rowData)} loading={loading}/>}
                )}
              </Col>
            </Row>

          </ReactCSSTransitionGroup>
        </Suspense>
      </BlockUi>
    </Fragment>
  );
}
