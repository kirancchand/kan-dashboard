import React ,{useState}from 'react'
import {Card, CardBody, Col, Container, Row } from "reactstrap";
import RightMenu from './RightMenu';
import RightMenuData from './RightMenuData';
import { UserTable } from './UserTable';
import Section from './Section';
interface SelectedLocalBodyType {
  district: string;
  localBodyType: string;
  key: string;
}

interface SelectedLocalBody {
  district: string;
  localBodyType: string;
  localbody_name: string;
  key: string;
}

interface SelectedBranch {
  district: string;
  localBodyType: string;
  localbody_name: string;
  branch_no: string;
  branch_name: string;
  key: string;
}
interface SelectedItems {
  districts: string[];
  localBodyTypes: SelectedLocalBodyType[];
  localBodies: SelectedLocalBody[];
  branchs: SelectedBranch[];
}
const KanDashboard = () => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selected, setSelected] = useState<SelectedItems>({
      districts: [],
      localBodyTypes: [],
      localBodies: [],
      branchs: []
    });
  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };
  console.log("selected",selected)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Row>
                  <Col md="12">
                    <UserTable selectedItems={selectedItems} rightClickBtn={toggleRightColumn} selected={selected}/>
                  </Col>
                </Row>
              </div>
            </Col>
              <RightMenuData rightColumn={rightColumn} hideRightColumn={toggleRightColumn} selected={selected} setSelected={setSelected}/>
            {/* <RightMenu rightColumn={rightColumn} hideRightColumn={toggleRightColumn} selectedItems={selectedItems} setSelectedItems={setSelectedItems} /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default KanDashboard



