import React, { useState } from "react";
import UserList from "./UserList";
import Location from "./Location";
import { GeoJSON } from "react-leaflet";

const Index = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [areaData, setAreaData] = useState<any[]>([]);
  const [branchData, setBranchData] = useState<any[]>([]);

  return (
    <>
      {!selectedUser ? (
        <UserList
          setSelectedUser={setSelectedUser}
         //
          areaOptions={areaData} 
          branchOptions={branchData}
        />
      ) : (
        <Location
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      )}
    </>
  );
};

export default Index;