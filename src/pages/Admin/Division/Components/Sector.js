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
import ListSector from './List/ListSector';
import RSelect from '../../../components/RSelect/RSelect';
import RSelectMulti from '../../../components/RSelectMulti/RSelectMulti';
import md from 'services/masterData';
import { toast } from 'react-toastify';
import http from '../../../services/http';
import { addSector } from '../Api';
export default function ManageSector() {
  const [loading,setLoading]=useState(false);
  const [stateData,setStateData]=useState([]);
  const [districtData,setDistrictData]=useState([]);
  const [regionData,setRegionData]=useState([]);
  const [areaData,setAreaData]=useState([]);
  const [branchData,setBranchData]=useState([]);
  const [stateLoading,setStateLoading]=useState(false);
  const [districtLoading,setDistrictLoading]=useState(false);
  const [regionLoading,setRegionLoading]=useState(false);
  const [areaLoading,setAreaLoading]=useState(false);
  const [branchLoading,setBranchLoading]=useState(false);
  let initialValue={
    state:null,
    district:null,
    region:null,
    area:null,
    branch:null,
    sector:""
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

  async function getArea(reqData) {
    setAreaLoading(true);
    md(reqData)
      .then((r) => {
        setAreaData(r);
        setAreaLoading(false);
      }).catch((error) => {
        toast(error, { position: 'top-right', type: 'error' });
        setAreaLoading(false);

      })
  }

  async function getBranch(reqData) {
    setBranchLoading(true);
    md(reqData)
      .then((r) => {
        setBranchData(r);
        setBranchLoading(false);
      }).catch((error) => {
        toast(error, { position: 'top-right', type: 'error' });
        setBranchLoading(false);
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

  const regionFunc=(value,setFieldValue)=>{
    setFieldValue("region",value)
    getArea({
      "requestName": "getAll_AreaByRegion",
      "params":[
        {
          "paramValue":value.value,
          "paramEncrypted": "Y"
        }
      ]
    })
  }

  const areaFunc=(value,setFieldValue)=>{
    setFieldValue("area",value)
    getBranch({
      "requestName": "getAll_BranchByArea",
      "params":[
        {
          "paramValue":4 ,
          "paramEncrypted": "Y"
        }
      ]
    })
  }

  async function addNewBranch(data) {
    setLoading(true)
    await http({
      method: 'POST',
      url: addSector,
      data: data,
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
    addNewBranch(values);
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
                          onChange={ev => regionFunc(ev,setFieldValue)}
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
                          name="area"
                          id="area"
                          value={values.area}
                          onChange={ev => areaFunc(ev,setFieldValue)}
                          options={areaData}
                          placeholder="--Select Area--"
                          error={errors.area}
                          touched={touched.area}
                          isLoading={areaLoading}
                          isClearable
                        />  
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Field
                          component={RSelect}
                          name="branch"
                          id="branch"
                          value={values.branch}
                          onChange={ev => setFieldValue("branch", ev)}
                          options={branchData}
                          placeholder="--Select Branch--"
                          error={errors.branch}
                          touched={touched.branch}
                          isLoading={branchLoading}
                          isClearable
                        />  
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <Field
                          type="text" 
                          name="sector"
                          id="sector"
                          value={values.sector}
                          placeholder="sector"
                          as={Input}
                          invalid={errors.sector && touched.sector}
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
                        <ListSector handleFunc={handleFunc} loading={loading} />
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
