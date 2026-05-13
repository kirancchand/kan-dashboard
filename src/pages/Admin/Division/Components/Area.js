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
import PageTitle from '../../Layout/AppPageTitle';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import ListArea from './List/ListArea';
import RSelect from '../../../components/RSelect/RSelect';
import RSelectMulti from '../../../components/RSelectMulti/RSelectMulti';
import md from 'services/masterData';
import { toast } from 'react-toastify';
import http from '../../../services/http';
import { addArea } from '../Api';
export default function ManageArea() {
  const [loading,setLoading]=useState(false);
  const [stateData,setStateData]=useState([]);
  const [districtData,setDistrictData]=useState([]);
  const [regionData,setRegionData]=useState([]);
  const [localbodytypeData,setLocalbodytypeData]=useState([]);
  const [stateLoading,setStateLoading]=useState(false);
  const [districtLoading,setDistrictLoading]=useState(false);
  const [regionLoading,setRegionLoading]=useState(false);
  const [localbodytypeLoading,setLocalbodytypeLoading]=useState(false);
  let initialValue={
    state:null,
    district:null,
    region:null,
    localbodytype:null,
    area:""
  }

  useEffect(()=>{
    async function getState() {
      setStateLoading(true);
      md('getAll_State')
        .then((r) => {
          setStateData(r);
          setStateLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setStateLoading(false);
        });
    }
    async function getLocalbodytype() {
      setLocalbodytypeLoading(true);
      md('getAll_Localbodytype')
        .then((r) => {
          setLocalbodytypeData(r);
          setLocalbodytypeLoading(false);
        }).catch((error) => {
          toast(error, { position: 'top-right', type: 'error' });
          setLocalbodytypeLoading(false);
        });
    }
    getLocalbodytype()
    getState()
  },[])

  async function getDistrict(reqData) {
    setDistrictLoading(true);
    md(reqData)
      .then((r) => {
        setDistrictData(r);
        setDistrictLoading(false);
      }).catch((error) => {
        toast(error, { position: 'top-right', type: 'error' });
        setDistrictLoading(false);
      });
  }

  async function getRegion(reqData) {
    setRegionLoading(true);
    md(reqData)
      .then((r) => {
        setRegionData(r);
        setRegionLoading(false);
      }).catch((error) => {
        toast(error, { position: 'top-right', type: 'error' });
        setRegionLoading(false);
      });
  }

  const stateFunc=(value,setFieldValue)=>{
    setFieldValue("state",value)
    setFieldValue("district",null)
    getDistrict({
      "requestName": "getAll_DistrictByState",
      "params":[
        {
          "paramValue":value.value,
          "paramEncrypted": "Y"
        }
      ]
    });
  }

  const districtFunc=(value,setFieldValue)=>{
    setFieldValue("district",value)
    getRegion({
      "requestName": "getAll_RegionByDistrict",
      "params":[
        {
          "paramValue":value.value,
          "paramEncrypted": "Y"
        }
      ]
    })
  }

  async function addNewArea(data) {
    console.log("data",data)
    setLoading(true)
    await http({
      method: 'POST',
      url: addArea,
      data,
    })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data)

          toast(response.data.message, { position: 'top-right', type: 'success' });

        });
        else {
          toast("Failed to Add State", { position: 'top-right', type: 'error' });
        });
        setLoading(false)
      })
      .catch(err => {
        toast(err, { position: 'top-right', type: 'error' });
        setLoading(false)
      });
  }

  const handleSubmit = (values, { resetForm }) => {
    addNewArea(values);
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
              heading="Division Management"
              subheading="Region"
              icon="pe-7s-news-paper icon-gradient bg-deep-blue"
              content="Division Management"
              activeContent="Region"
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
                    <Col md="3">
                      <FormGroup>
                        <Field
                          component={RSelect}
                          name="state"
                          id="state"
                          value={values.state}
                          onChange={ev => stateFunc(ev, setFieldValue)}
                          options={stateData}
                          placeholder="--Select State--"
                          error={errors.state}
                          touched={touched.state}
                          isLoading={stateLoading}
                          isClearable
                        />  
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Field
                          component={RSelect}
                          name="district"
                          id="district"
                          value={values.district}
                          onChange={ev => districtFunc(ev, setFieldValue)}
                          options={districtData}
                          placeholder="--Select District--"
                          error={errors.district}
                          touched={touched.district}
                          isLoading={districtLoading}
                          isClearable
                        />  
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Field
                          component={RSelect}
                          name="region"
                          id="region"
                          value={values.region}
                          onChange={ev => setFieldValue("region", ev)}
                          options={regionData}
                          placeholder="--Select Region--"
                          error={errors.region}
                          touched={touched.region}
                          isLoading={regionLoading}
                          isClearable
                        />  
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Field
                          component={RSelect}
                          name="localbodytype"
                          id="localbodytype"
                          value={values.localbodytype}
                          onChange={ev => setFieldValue("localbodytype", ev)}
                          options={localbodytypeData}
                          placeholder="--Select Localbodytype--"
                          error={errors.localbodytype}
                          touched={touched.localbodytype}
                          isLoading={localbodytypeLoading}
                          isClearable
                        />  
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Field
                          type="text" 
                          name="area"
                          id="area"
                          value={values.area}
                          placeholder="area"
                          as={Input}
                          invalid={errors.area && touched.area}
                          autoComplete="off"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <Button type="submit" color="primary">Save</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      {!loading && (
                        <ListArea handleFunc={handleFunc} loading={loading} />
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
  )
}
