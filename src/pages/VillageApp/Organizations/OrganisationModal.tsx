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
  InputGroupText,
  Label,
} from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
const OrganisationModal = (props:any) => {

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
        <ModalBody>
        {props.children}
        </ModalBody>
      </Modal>
    </Fragment>
  );
};
export default OrganisationModal;
