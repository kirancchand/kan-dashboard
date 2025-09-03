import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Label, Row } from "reactstrap";
import axios from "axios";
import { fetchkeyvalues } from '../../pages/Services/Api';
import { useLocation } from "react-router-dom";
function Addbooks() {
  const location = useLocation();
  const bookToEdit = location.state?.book;
  const validationSchema = Yup.object({
    name: Yup.string().required("Book name is required"),
    author: Yup.string().required("Author name is required"),
    bookdescription: Yup.string().required("publisher name is required"),
    bookquantity: Yup.string().matches(/^[1-9][0-9]*$/, "Quantity must be a positive number")
      .required("Quantity is required"),
    bookfor: Yup.string().required("Bookfor is required").matches(/^(Buy|Rent)$/, "Book for must be Buy or Rent"),
    bookstatus: Yup.string().required("Book Status is required").matches(/^(Available|Rented|Sold)$/, "Book status must be Available,Rented or Rent"),
    language: Yup.string().required("Language is required").matches(/^(Malayalam|English|Hindi)$/, "Language must be Malayalam,English or Hindi"),
    buyprice: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than 0")
      .max(999999, "Price is too high")
      .required("Price is required"),
    rentPrice: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than 0")
      .max(999999, "Price is too high")
      .required("Price is required"),
  });
  // const getAll_BookFor = {}; 
  const fetchKeyValue = async () => {
    try {
      const response = await axios.post(fetchkeyvalues, {
        "requestName": "getAll_BookFor"
      });
      console.log("Fetched:", response);

    } catch (error) {
      console.error("Error fetching keyValue:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchKeyValue()

  }, []);
  return (

    <div className="book-form-container">
      <div className="book-form-header">
        <Link to='/book-list'>  <button className="btn btn-secondary" >

          Back to Books
        </button></Link>
        <h2>{bookToEdit ? "Edit Book" : "Add New Book"}</h2>
      </div>

      <div className="book-form-content">


        <Formik
          initialValues={{
            name: bookToEdit?.name || "",
            author: bookToEdit?.author || "",
            bookdescription: bookToEdit?.bookdescription || "",
            bookfor: bookToEdit?.bookfor || "",
            bookquantity: bookToEdit?.bookquantity || "",
            bookstatus: bookToEdit?.bookstatus || "",
            language: bookToEdit?.language || "",
            buyprice: bookToEdit?.buyprice || "",
            rentprice: bookToEdit?.rentprice || "",
          }}
            enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form submitted values:", values);
            axios
              .post("")
              .then((response) => {
                console.log("Success:", response.data);

              })
              .catch((error) => {
                console.error("Error:", error);
              });

          }}
        >
            {({ values, handleChange }) => (
          <Form>
            <div className="form-grid">
              <div className="form-group">
                <Label htmlFor="name">Book Name *</Label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter book name"
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>

              <div className="form-group">
                <Label htmlFor="author">Author *</Label>
                <Field
                  type="text"
                  id="author"
                  name="author"

                  placeholder="Enter author name"
                />
                <ErrorMessage name="author" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="condition">Book For</label>
                <select
                  id="condition"
                  name="bookfor"

                >
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="buy-rent">Buy or Rent</option>

                </select>
                {/* <ErrorMessage name="bookfor" component="div" className="error" /> */}
              </div>

              <div className="form-group">
                <label htmlFor="bookdescription">Book description *</label>
                <input
                  type="text"
                  id="publisher"
                  name="bookdescription"

                  placeholder="Enter Description"
                />
                <ErrorMessage name="bookdescription" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="book_quantity">Book Quantity *</label>
                <input
                  type="text"
                  id="listerBy"
                  name="bookquantity"
                  min="0"
                  step="0.01"
                  placeholder="Enter Quantity"
                />
                <ErrorMessage name="bookquantity" component="div" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="bookstatus">Book Status</label>
                <select
                  id="condition"
                  name="bookstatus"

                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="sold">Sold</option>

                </select>
                {/* <ErrorMessage name="bookstatus" component="div" className="error" /> */}
              </div>
              <div className="form-group">
                <label htmlFor="Language">Language</label>
                <select
                  id="condition"
                  name="Language"

                >
                  <option value="malayalam">Malayalam</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>

                </select>
                {/* <ErrorMessage name="Language" component="div" className="error" /> */}
              </div>
              <div className="form-group">
                <label htmlFor="booktype">Book Type</label>
                <select
                  id="availability"
                  name="booktype"

                >
                  <option value="all">All</option>
                  <option value="drama">Drama</option>
                  <option value="sciencefiction">Sci-Fi</option>
                  <option value="novel">Novel</option>
                  <option value="shortstory">Short Story</option>
                  <option value="epics">Epics</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="isbn">ISBN *</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"

                  placeholder="Enter ISBN (e.g., 978-0-123456-78-9)"
                />

              </div>

              <div className="form-group">
                <label htmlFor="availability">Availability</label>
                <select
                  id="availability"
                  name="availability"

                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="sold">Sold</option>
                </select>
              </div>



              <div className="form-group">
                <label htmlFor="buyPrice">Buy Price ($) *</label>
                <input
                  type="number"
                  id="buyPrice"
                  name="buyprice"

                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                <ErrorMessage name="buyprice" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="rentPrice">Rent Price ($) *</label>
                <input
                  type="number"
                  id="rentPrice"
                  name="rentPrice"

                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                <ErrorMessage name="rentprice" component="div" className="error" />
              </div>



              <div className="form-group full-width">
                <label htmlFor="coverImage">Cover Image URL</label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"

                  placeholder="Enter cover image URL"
                />
              </div>
            </div>

            <div className="form-actions">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isVisible"

                  />
                  <span className="checkbox-text">Make book visible to users</span>
                </label>
              </div>
              <div className="action-buttons">
                <button type="button" className="btn btn-secondary" >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">

                 {bookToEdit ? "Update Book" : "Save Book"}
                </button>
              </div>
            </div>
          </Form>
            )}
        </Formik>
      </div>
    </div>
  )
}

export default Addbooks
