import React, { Fragment, useState, useEffect, useRef } from 'react';
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
  CardHeader,
  FormGroup,
  Input,
  InputGroup,
  Button,
  Label,
  FormFeedback,
} from 'reactstrap';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import { property } from 'lodash';
import RSelect from '../../../../components/RSelect/RSelect';
const UserModal = props => {
  const [wardData, setWardData] = useState([
    { value: 1, label: 'ward 1' },
    { value: 2, label: 'ward 2' },
  ]);
  const [wardLoading, setWardLoading] = useState(false);
  const [religionData, setReligionData] = useState([
    { value: 1, label: 'ward 1' },
    { value: 2, label: 'ward 2' },
  ]);
  const [religionLoading, setReligionLoading] = useState(false);
  const [casteData, setCasteData] = useState([
    { value: 1, label: 'ward 1' },
    { value: 2, label: 'ward 2' },
  ]);
  const [casteLoading, setCasteLoading] = useState(false);
  const [qualificationData, setQualificationData] = useState([
    { value: 1, label: 'ward 1' },
    { value: 2, label: 'ward 2' },
  ]);
  const [qualificationLoading, seQualificationLoading] = useState(false);
  const [subjectData, setSubjectData] = useState([
    { value: 1, label: 'ward 1' },
    { value: 2, label: 'ward 2' },
  ]);
  const [subjectLoading, setSubjectLoading] = useState(false);

  const initialValue = {
    firstName: '',
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
        <Formik initialValues={initialValue}>
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
              <ModalBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>First Name</Label>
                      <Field
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={values.firstName}
                        placeholder="First Name"
                        as={Input}
                        invalid={errors.firstName && touched.firstName}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Middle Name</Label>
                      <Field
                        type="text"
                        name="middleName"
                        id="middleName"
                        value={values.middleName}
                        placeholder="Middle Name"
                        as={Input}
                        invalid={errors.middleName && touched.middleName}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Last Name</Label>
                      <Field
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={values.lastName}
                        placeholder="Last Name"
                        as={Input}
                        invalid={errors.lastName && touched.lastName}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Email Id</Label>
                      <Field
                        type="text"
                        name="emailId"
                        id="emailId"
                        value={values.emailId}
                        placeholder="Email Id"
                        as={Input}
                        invalid={errors.emailId && touched.emailId}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Date Of Birth</Label>
                      <Field
                        type="text"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={values.dateOfBirth}
                        placeholder="Date Of Birth"
                        as={Input}
                        invalid={errors.dateOfBirth && touched.dateOfBirth}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Gender</Label>
                      <Field
                        type="text"
                        name="gender"
                        id="gender"
                        value={values.gender}
                        placeholder="Gender"
                        as={Input}
                        invalid={errors.gender && touched.gender}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Voter Id</Label>
                      <Field
                        type="text"
                        name="voterId"
                        id="voterId"
                        value={values.voterId}
                        placeholder="Voter Id"
                        as={Input}
                        invalid={errors.voterId && touched.voterId}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Aadhar</Label>
                      <Field
                        type="text"
                        name="aadharId"
                        id="aadharId"
                        value={values.aadharId}
                        placeholder="Aadhar"
                        as={Input}
                        invalid={errors.aadharId && touched.aadharId}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Pancard</Label>
                      <Field
                        type="text"
                        name="pancardId"
                        id="pancardId"
                        value={values.pancardId}
                        placeholder="Pancard Id"
                        as={Input}
                        invalid={errors.pancardId && touched.pancardId}
                        autoComplete="off"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Ward</Label>
                      <Field
                        component={RSelect}
                        name="ward"
                        id="ward"
                        value={values.ward}
                        onChange={ev => setFieldValue('ward', ev)}
                        options={wardData}
                        placeholder="--Select Ward--"
                        error={errors.ward}
                        touched={touched.ward}
                        isLoading={wardLoading}
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Religion</Label>
                      <Field
                        component={RSelect}
                        name="religion"
                        id="religion"
                        value={values.religion}
                        onChange={ev => setFieldValue('religion', ev)}
                        options={religionData}
                        placeholder="--Select Religion--"
                        error={errors.religion}
                        touched={touched.religion}
                        isLoading={religionLoading}
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Caste</Label>
                      <Field
                        component={RSelect}
                        name="caste"
                        id="caste"
                        value={values.caste}
                        onChange={ev => setFieldValue('caste', ev)}
                        options={casteData}
                        placeholder="--Select Caste--"
                        error={errors.caste}
                        touched={touched.caste}
                        isLoading={casteLoading}
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Qualification</Label>
                      <Field
                        component={RSelect}
                        name="qualification"
                        id="qualification"
                        value={values.qualification}
                        onChange={ev => setFieldValue('qualification', ev)}
                        options={qualificationData}
                        placeholder="--Select Qualification--"
                        error={errors.qualification}
                        touched={touched.qualification}
                        isLoading={qualificationLoading}
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Subject</Label>
                      <Field
                        component={RSelect}
                        name="subject"
                        id="subject"
                        value={values.subject}
                        onChange={ev => setFieldValue('subject', ev)}
                        options={subjectData}
                        placeholder="--Select Subject--"
                        error={errors.subject}
                        touched={touched.subject}
                        isLoading={subjectLoading}
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter />
            </Form>
          )}
        </Formik>
      </Modal>
    </Fragment>
  );
};
export default UserModal;
