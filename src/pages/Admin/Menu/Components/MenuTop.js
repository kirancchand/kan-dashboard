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
import RemotePagination from '../../../components/Common/ReactDatatableNext/BootstrapTableNext.js';
import List from './List';
import ReactLogo from '../../../images/svg0.svg';
import $ from 'jquery';
import Ionicon from 'react-ionicons';
export default function ManageMenu() {
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState([{id:1,menu:"menu 1"}]);
  const [field,setField]=useState([{fieldName:"Sl No",fieldData:"id"},{fieldName:"Menu",fieldData:"menu"},{fieldName:"Action",fieldData:"id"}])
  let initialValue={
    menu:"",
  }
  const handleSubmit=(values)=>{
    values.id=data.length+1;
    console.log([...data,values]);
    setData([...data,values])
  }

  useEffect(() => {
    // set the first nav item as active
    var dis = $(".list-wrap li").eq(0);

    // align the wave
    align(dis);

    // align the wave on click
    $(".list-wrap li").click(function(){
      dis = $(this);
      align(dis);
    });

    $('body').on('keydown',function(e){
      var code = e.keyCode || e.which;
      if (code == 9) {
        if (dis.is(':last-child')) {
          $(".list-wrap li:nth-child(1)").trigger("click");
        }
        else{
          dis.next().trigger("click");
        }
      }
      } 
    });

    $("body").keydown(function(e) {
      if(e.keyCode == 37) { // left
        $("#showroom").animate({
          left: "-=980"
        });
      }
      else if(e.keyCode == 39) { // right
        $("#showroom").animate({
          left: "+=980"
        });
      }
    });

    function align(dis){
      // get index of item
      var index = dis.index() + 1;
      // add active class to the new item
      $(".list-wrap li").removeClass("active");
      dis.delay(100).queue(function() {
        dis.addClass('active').dequeue();
      });

      // move the wave
      var left = index * 80 - 90;
      console.log("index",left)
      $("#wave").css('left', left);
      // ▼ this is not necessary for the navigation ▼

      // set the background color
      var color = dis.data('color');
      $("body").css('background', color);
      // set the text
      $(".page").text(dis.attr("title"));
    }
  }, []);
  return(
    <Fragment>
      <Row>
        <Col md="12">
          <div className="phone">
            <nav>
              <ul className="list-wrap">
                <li
                  data-color="linear-gradient(to bottom, #09203f 0%, #537895 100%)"
                  title="Home"
                >
              
                  {/* <i className="pe-7s-piggy icon-gradient bg-night-fade btn-icon-wrapper btn-icon-lg mb-3"> </i> */}
                  {/* <Ionicon icon="md-grid"/> */}
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#ff6b81" title="Profile">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#7bed9f" title="Get a beer!">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#70a1ff" title="Files">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#dfe4ea" title="Settings">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#dfe4ea" title="Settings">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#dfe4ea" title="Settings">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#dfe4ea" title="Settings">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#dfe4ea" title="Settings">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#dfe4ea" title="Settings">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#dfe4ea" title="Settings">
                  <i className="lnr-home"></i>
                </li>
                <li data-color="#dfe4ea" title="Settings">
                  <i className="lnr-home"></i>
                </li>
              </ul>
              <div className="wave-wrap">
                <img src={ReactLogo} alt="React Logo" id="wave" />
              </div>
              <div className="page">Home</div>
            </nav>
          </div>
          </div>
        </Col>
      </Row>
    </Fragment>
    //     <Fragment>
    //   <BlockUi tag="div" blocking={loading} loader={<Loader active type='ball-spin-fade-loader' />}>
    //     <Suspense fallback={<Loader type="ball-pulse-rise" />}>

  //       <ReactCSSTransitionGroup
  //         component="div"
  //         transitionAppear={true}
  //         transitionName="MainAnimation"
  //         transitionAppearTimeout={0}
  //         transitionEnter={false}
  //         transitionLeave={false}
  //       >
  //         <PageTitle
  //           heading="Menu Management"
  //           subheading="Menu"
  //           icon="pe-7s-news-paper icon-gradient bg-deep-blue"
  //           content="Menu Management"
  //           activeContent="Menu"
  //         />
  //          <Formik
  //        initialValues={initialValue}
  //       //  validationSchema={firContentValidateSchema}
  //        onSubmit={handleSubmit}
  //        >
  //   {({
  //       errors,
  //       touched,
  //       isSubmitting,
  //       dirty,
  //       resetForm,
  //       values,
  //       setFieldValue,
  //       setFieldTouched,
  //     }) => (
  //         <Form>

  //           <Row>
  //           <Col md="4">
  //                         <FormGroup>
  //                         <Field
  //                             type="text"
  //                             name="menu"
  //                             id="menu"
  //                             value={values.menu}
  //                             placeholder="menu"
  //                             as={Input}
  //                             invalid={errors.menu && touched.menu}
  //                             autoComplete="off"
  //                           />
  //                         </FormGroup>
  //                         </Col>
  //                         <Col md="4">
  //                             <Button type="submit" color="primary">Save</Button>
  //                         </Col>
  //                      </Row>
  //                      <Row>
  //                          <Col md="12">
  //                          <List
  //                             data={data}
  //                             page={1}
  //                             sizePerPage={10}
  //                             totalSize={data.length}
  //                             keyField="id"
  //                             field={field}
  //                          />
  //                          </Col>

  //                      </Row>

  //         </Form>
  //       )}

  //   </Formik>

  //       </ReactCSSTransitionGroup>
  //     </Suspense>
  //   </BlockUi>
  // </Fragment>
  )
}
