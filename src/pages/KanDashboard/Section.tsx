import React from 'react';
import { Col, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr";

const Section = (props:any) => {
    return (
        <React.Fragment>
            <Row className="mb-3 pb-1">
                <Col xs={12}>
                    <div className="d-flex flex-lg-row flex-column">
                        <div className="flex-grow-1">
                            <h4 className="fs-16 mb-1">User Search</h4>
                            <p className="text-muted mb-0">Here's what's shown now.</p>
                        </div>
                        <div className="mt-3 mt-lg-0">
                                <Row className="g-3 mb-0 ">
                                    <div className="col-sm-auto">
                                        <div className="input-group">
                                           {props.children}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <button type="button" className="btn btn-soft-info btn-icon waves-effect waves-light layout-rightside-btn" onClick={props.rightClickBtn} ><i className="ri-pulse-line"></i></button>
                                    </div>
                                </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;