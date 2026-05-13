import React, { useState, useEffect,Fragment,Suspense } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Loader from 'react-loaders';
import PageTitle from './../../Layout/AppPageTitle';
import {
    Row,Col,Card,CardBody,CardTitle,CardHeader,FormGroup,
    Input,InputGroup,InputGroupAddon,InputGroupText,
    Button,Label,FormFeedback,CardFooter
  } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import RSelect from '../../../components/RSelect/RSelect';
import RSelectMulti from '../../../components/RSelectMulti/RSelectMulti';
import ListMuncipality from './List/ListMuncipality';
export default function ManageMuncipality()
{
    const [loading,setLoading]=useState(false);
    const [stateData,setStateData]=useState([{value:1,label:"state 1"}]);
    const [districtData,setDistrictData]=useState([{value:1,label:"district 1"},{value:2,label:"district 2"}]);
    const [stateLoading,setStateLoading]=useState(false);
    const [districtLoading,setDistrictLoading]=useState(false);
    const [data,setData]=useState([{id:1,state:{value:1,label:"state 1"},district:"district 1"}]);
    const [field,setField]=useState([{fieldName:"Sl No",fieldData:"id"},{fieldName:"State",fieldData:"state"},{fieldName:"District",fieldData:"district"},{fieldName:"Muncipality",fieldData:"muncipality"},{fieldName:"Action",fieldData:""}])
    let initialValue={
        state:null,
        district:null,
        ward:""
       }

    
    const handleSubmit=(values)=>{
        setData([...data,values])
    }
    return(
        <Fragment>
      <BlockUi tag="div" blocking={loading} loader={<Loader active type='ball-spin-fade-loader' />}>
        <Suspense fallback={<Loader type="ball-pulse-rise" />}>

          <ReactCSSTransitionGroup
            component="div"
            transitionAppear={true}
            transitionName="MainAnimation"
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
          >
            <PageTitle
              heading="Division Management"
              subheading="Muncipality"
              icon="pe-7s-news-paper icon-gradient bg-deep-blue"
              content="Division Management"
              activeContent="Muncipality"
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
                            onChange={ev => setFieldValue("state",ev)}
                            options={stateData}
                            placeholder="--Select State--"
                            error={errors.state}
                            touched={touched.state}
                            isLoading={stateLoading}
                            isClearable={true}
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
                            onChange={ev => setFieldValue("district",ev)}
                            options={districtData}
                            placeholder="--Select DIstrict--"
                            error={errors.district}
                            touched={touched.district}
                            isLoading={districtLoading}
                            isClearable={true}
                            />  
                            </FormGroup>
                            </Col>               
                            <Col md="3">
                            <FormGroup>
                            <Field
                                type="text" 
                                name="muncipality"
                                id="muncipality"
                                value={values.muncipality}
                                placeholder="muncipality"
                                as={Input}
                                invalid={errors.muncipality && touched.muncipality}
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
                             <ListMuncipality
                                data={data}
                                page={1}
                                sizePerPage={10}
                                totalSize={data.length}
                                keyField="id"
                                field={field}
                             />
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