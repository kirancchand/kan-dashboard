import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import DuplicateId from "./DuplicateId";
import AgeBarGraph from "./AgeBarGraph";
import Section from "./Section";
import RightMenu from '../KanDashboard/RightMenu';
import RightMenuData from '../KanDashboard/RightMenuData';
import TestChart from './TestChart';
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

interface SelectedWard {
  district: string;
  localBodyType: string;
  localbody_name: string;
  ward_no: string;
  ward_name: string;
  key: string;
}
interface SelectedItems {
  districts: string[];
  localBodyTypes: SelectedLocalBodyType[];
  localBodies: SelectedLocalBody[];
  wards: SelectedWard[];
}
const UserAnalytics = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selected, setSelected] = useState<SelectedItems>({
        districts: [],
        localBodyTypes: [],
        localBodies: [],
        wards: []
      });
  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />
                {/* <Row>
                
                </Row> */}
                <Row>
                   <DuplicateId selectedItems={selectedItems} selected={selected}/>
                   <AgeBarGraph selectedItems={selectedItems} selected={selected}/>
                  {/* <Col xl={3}> */}
                 
                  {/* </Col> */}
                  {/* <SalesByLocations /> */}

                 
                </Row>
                {/* <TestChart/> */}
                {/* <Row>
                  <BestSellingProducts />
                  <TopSellers />
                </Row>
                <Row>
                  <StoreVisits />
                  <RecentOrders />
                </Row> */}
              </div>
            </Col>
            <RightMenuData rightColumn={rightColumn} hideRightColumn={toggleRightColumn} selected={selected} setSelected={setSelected}/>
            {/* <RightMenu rightColumn={rightColumn} hideRightColumn={toggleRightColumn} selectedItems={selectedItems} setSelectedItems={setSelectedItems} /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserAnalytics;
