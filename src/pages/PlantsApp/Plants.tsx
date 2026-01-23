import React, { useEffect, useMemo, useState } from 'react';
import { TableContainer } from "../../Responsive Table/TableContainerReactTable"
import { Link } from 'react-router-dom';
import { Spinner, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { SortInterface, SortTanstackInterface } from '../../Typecomponents/ComponentsType';
import Swal from 'sweetalert2';
import { Input, Button, Col, Row } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from "axios";

const Plants = () => {
    return (
        <React.Fragment>
            <div style={{ padding: '50px', marginTop: '50px'}}>
                <div className="plants-header">
                    <h1>Plants</h1>
                    <Link to='/plants-form'>   <button className="btn btn-primary"  >
                        Add New Plant
                    </button></Link>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Plants