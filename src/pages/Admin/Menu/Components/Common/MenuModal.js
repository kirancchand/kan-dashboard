import React, { Fragment, useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  InputGroup,
  Button,
  FormFeedback,
  InputGroupAddon,
  InputGroupText,
  Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SaveBtn, AddTBtn } from 'components/Button';
import RSelect from 'components/RSelect/RSelect';
import md from 'services/masterData';
import { toast } from 'react-toastify';
import http from 'services/http';
import { addMenu } from '../../Api';
const MenuModal = props => {
  const [loading, setLoading] = useState(props.loading);
  const [parentData, setParentData] = useState([]);
  const [parentLoading, setParentLoading] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const initialValue = {
    menu: '',
    parent: null,
    to: '',
    component: '',
    controller: '',
    icon: '',
    position: '',
    status: null,
    menutype: '2',
  };

  useEffect(() => {
    async function getParent() {
      setParentLoading(true);
      md('getAll_Menu')
        .then(r => {
          setParentData(r);
          setParentLoading(false);
        })
        .catch(error => {
          toast(error, { position: 'top-right', type: 'error' });
          setParentLoading(false);
        });
    }
    async function getStatus() {
      setParentLoading(true);
      md('getAll_Status')
        .then(r => {
          setStatusData(r);
          setStatusLoading(false);
        })
        .catch(error => {
          toast(error, { position: 'top-right', type: 'error' });
          setStatusLoading(false);
        });
    }

    getParent();
    getStatus();
  }, []);

  async function addNewMenu(data) {
    console.log('data', data);
    props.setLoading(true);
    await http({
      method: 'POST',
      url: addMenu,
      data,
    })
      .then(function(response) {
        if (response.status === 200) {
          console.log(response.data);

          toast(response.data.message, {
            position: 'top-right',
            type: 'success',
          });
          props.hide();
          // returnFunc()
        } else {
          toast('Failed to Add State', {
            position: 'top-right',
            type: 'error',
          });
        }
        props.setLoading(false);
      })
      .catch(err => {
        toast(err, { position: 'top-right', type: 'error' });
        props.setLoading(false);
      });
  }

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    addNewMenu(values);
    setSubmitting(true);
    resetForm();
  };

  const closeBtn = (
    <button className="close" onClick={props.hide}>
      &times;
    </button>
  );
  return (
    <Fragment>
      <Modal
        isOpen={props.isShowing}
        toggle={props.hide}
        backdrop
        style={props.style}
      >
        <ModalHeader toggle={props.hide} close={closeBtn}>
          {props.name}
        </ModalHeader>
        <Formik
          initialValues={initialValue}
          // validationSchema={aliasNameValidateSchema}
          onSubmit={handleSubmit}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              dirty,
              resetForm,
              setFieldValue,
              setFieldTouched,
            } = props;
            return (
              <Form>
                <ModalBody>
                  <Row>
                    <Col md="3">
                      <Label>Menu</Label>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Field
                          type="text"
                          name="menu"
                          id="menu"
                          value={values.menu}
                          placeholder="menu"
                          as={Input}
                          invalid={errors.menu && touched.menu}
                          autoComplete="off"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <Label>Parent</Label>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Field
                          component={RSelect}
                          name="parent"
                          id="parent"
                          value={values.parent}
                          onChange={ev => setFieldValue('parent', ev)}
                          options={parentData}
                          placeholder="--Select Parent--"
                          error={errors.parent}
                          touched={touched.parent}
                          isLoading={parentLoading}
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <Label>To</Label>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Field
                          type="text"
                          name="to"
                          id="to"
                          value={values.to}
                          placeholder="to"
                          as={Input}
                          invalid={errors.to && touched.to}
                          autoComplete="off"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <Label>Component</Label>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Field
                          type="text"
                          name="component"
                          id="component"
                          value={values.component}
                          placeholder="component"
                          as={Input}
                          invalid={errors.component && touched.component}
                          autoComplete="off"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <Label>Controller</Label>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Field
                          type="text"
                          name="controller"
                          id="controller"
                          value={values.controller}
                          placeholder="controller"
                          as={Input}
                          invalid={errors.controller && touched.controller}
                          autoComplete="off"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
            <Col md="6">Icon</Col><Col md="6"></Col>
          </Row> */}
                  <Row>
                    <Col md="3">
                      <Label>Position</Label>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Field
                          type="text"
                          name="position"
                          id="position"
                          value={values.position}
                          placeholder="position"
                          as={Input}
                          invalid={errors.position && touched.position}
                          autoComplete="off"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <Label>Status</Label>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Field
                          component={RSelect}
                          name="status"
                          id="status"
                          value={values.status}
                          onChange={ev => setFieldValue('status', ev)}
                          options={statusData}
                          placeholder="--Select Status--"
                          error={errors.status}
                          touched={touched.status}
                          isLoading={statusLoading}
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
            <Col md="6">Menu Type</Col><Col md="6"></Col>
          </Row> */}
                </ModalBody>
                <ModalFooter>
                  <Button className="primary" type="submit">
                    Save
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </Fragment>
  );
};
export default MenuModal;
