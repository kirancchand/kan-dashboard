import { Col, Label, Input, Row } from "reactstrap"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchaddCategory } from '../../pages/Services/Api'
const validationSchema = Yup.object({
  category_name: Yup.string().required('name is required'),
  category_icon: Yup.string().required('icon name is required'),
  category_subtitle: Yup.string().required('sub title is required'),
});

  const fetchData = async (reqData: any) => {
   

    try {
      const response = await fetch(fetchaddCategory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      console.log("API Response:", result);

      
      
    } catch (err: any) {
      
    } 
  };
function AddCatageories() {
    return (
        <div>
             <Formik
                initialValues={{ category_icon: '',category_name:'',category_subtitle:'' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                     console.log("Form submitted values:", values); 
                     fetchData(values)
            }}
            >
                <Form>
            <h4 style={{marginBottom:'15px',marginTop:'110px'}}>Categories</h4>
            <Row style={{ padding: '50px',marginTop:'15px',backgroundColor:'#fff' }}>
                <Col md={6}>
                    <div className="mb-3">
                        <Label for="firstNameinput" className="form-label">Categorie Name</Label>
                        <Field type="text"  className="form-control" name="category_name" placeholder="Enter your full Categorie Name"  />
                        <ErrorMessage name="category_name"  component="div" className='error'  />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-3">
                        <Label for="lastNameinput" className="form-label">Icon Name</Label>
                        <Field type="text"  className="form-control" name="category_icon" placeholder="Enter your full icon Name"  />
                        <ErrorMessage name="category_icon"  component="div" className='error'  />
                    </div>
                </Col>
                <Col md={12}>
                    <div className="mb-3">
                        <Label for="compnayNameinput" className="form-label">Sub Title</Label>
                        <Field type="text"  className="form-control" name="category_subtitle" placeholder="Enter your subtitle"  />
                        <ErrorMessage name="category_subtitle"  component="div" className='error'  />
                    </div>
                </Col>
                <Col md={12}>
                    <div className="text-end">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </Col>
            </Row>
            </Form>
            </Formik>
        </div>
    )
}
export default AddCatageories