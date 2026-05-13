import React from "react";
import { Link } from "react-router-dom";

const VillageApp = () => {
  return (
    <div>
      <h1>Village App</h1>

      <Link to="/villageapp/appname">Go to Appname</Link>
      <Link to="/villageapp/carousal">Go to Carousal</Link>
      <Link to="/villageapp/emergencyservices">Go to EmergencyServices</Link>
      <Link to="/villageapp/users">Go to Users</Link>
      <Link to="/villageapp/category">Go to Category</Link>
      <Link to="/villageapp/organizations">Go to  Organizations</Link>
      <Link to="/villageapp/advertisement">Go to Advertisement</Link>
      <Link to="/villageapp/state">Go to State</Link>
      <Link to="/villageapp/district">Go to District</Link>
      <Link to="/villageapp/area">Go to Area</Link>
      <Link to="/villageapp/branch">Go to Branch</Link>
      <Link to="/villageapp/organizationMember">Go to Organization Members</Link>


    </div>
  );
};

export default VillageApp;