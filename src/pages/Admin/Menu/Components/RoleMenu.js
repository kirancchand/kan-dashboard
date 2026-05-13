import React, { useState, useEffect, Fragment, Suspense } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Loader from 'react-loaders';
import {
    Row,Col,Card,CardBody,CardTitle,CardHeader,FormGroup,
    Input,InputGroup,InputGroupAddon,InputGroupText,
    Button,Label,FormFeedback,CardFooter
  } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import ListRoleMenu from './List/ListRoleMenu';
import RSelect from '../../../components/RSelect/RSelect';
import RSelectMulti from '../../../components/RSelectMulti/RSelectMulti';
import { toast } from 'react-toastify';
import http from 'services/http';
import md from 'services/masterData';
import PageTitle from '../../Layout/AppPageTitle';
import { addRoleMenu } from '../Api';
export default function ManageRoleMenu() {
  const [loading,setLoading]=useState(false);
  const [roleData,setRoleData]=useState([{value:1,label:"role 1"}]);
  const [menuData,setMenuData]=useState([{value:1,label:"menu 1"},{value:2,label:"menu 2"}]);
  const [roleLoading,setRoleLoading]=useState(false);
  const [menuLoading,setMenuLoading]=useState(false);

  useEffect(()=>{
    async function getRole() {
      setRoleLoading(true);
      md('getAll_Role')
        .then((r) => {
          setRoleData(r);
          setRoleLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setRoleLoading(false);
        });
    }

    async function getMenu() {
      setMenuLoading(true);
      md('getAll_Menu')
        .then((r) => {
          setMenuData(r);
          setMenuLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setMenuLoading(false);
        });
    }

    getRole()
    getMenu()
  },[])

  let initialValue={
    role:null,
    menu:[]
  }
  const roleFunc=(value,setFieldValue)=>{
    setFieldValue("role",value)

  }
  const menuFunc=(value,setFieldValue)=>{
    setFieldValue("menu",value)
  }

  async function addNewRoleMenu(data) {
    console.log("data",data)
    setLoading(true)
    await http({
      method: 'POST',
      url: addRoleMenu,
      data,
    })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data)

          toast(response.data.message, { position: 'top-right', type: 'success' });
          });
        } else {
          toast("Failed to Add State", { position: 'top-right', type: 'error' });
        });
        setLoading(false)
      })
      .catch(err => {
        toast(err, { position: 'top-right', type: 'error' });
        setLoading(false)
      });
  }

  const handleSubmit=(values,{resetForm})=>{
    addNewRoleMenu(values)
    resetForm()
  }

  const handleFunc=()=>{
      
  }
  return(
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
              subheading="Role Menu"
              icon="pe-7s-news-paper icon-gradient bg-deep-blue"
              content="Menu Management"
              activeContent="Role Menu"
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
                    <Col md="5">
                      <FormGroup>
                        <Field
                          component={RSelect}
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
                    <Col md="5">
                      <FormGroup>
                        <InputGroup>
                          <Field
component={RSelectMulti}
                            name="menu"
                            id="menu"
                            onChange={(ev) => menuFunc(ev,setFieldValue)}
                            value={values.menu}
                            options={menuData}
                            isLoading={menuLoading}
                            // isDisabled={isOptionDisabled}
                            isClearable
                            error={errors.menu}
                            touched={touched.menu}
                          />
                          <FormFeedback>
                            <ErrorMessage name="menu" />
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <Button type="submit" color="primary">Save</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      {/* <ListRoleMenu 
                                data={data}
                                page={1}
                                sizePerPage={10}
                                totalSize={data.length}
                                keyField="id"
                                field={field}
                             /> */}
                      {!loading&&<ListRoleMenu handleFunc={handleFunc} loading={loading}/>}
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </ReactCSSTransitionGroup>
        </Suspense>
      </BlockUi>
    </Fragment>
  )
}
