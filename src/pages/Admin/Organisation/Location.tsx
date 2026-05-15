import React, { useMemo } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { Card, CardBody, Button } from "reactstrap";

import geoData from "../data/geo.json";

interface Props {
  selectedUser: any;
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>;
}

const Location = ({ selectedUser, setSelectedUser }: Props) => {
 
  const dataList = geoData?.data || [];

  
  const feature = useMemo(() => {
    if (!selectedUser) return null;

    return dataList.find((item: any) => {
      return (
        Number(item.branch_id) === Number(selectedUser.branch_id) ||
        Number(item.branch_id) === Number(selectedUser.id)
      );
    });
  }, [selectedUser, dataList]);

 
  const geometry = useMemo(() => {
    if (!feature?.geometry) return null;

    try {
      return typeof feature.geometry === "string"
        ? JSON.parse(feature.geometry)
        : feature.geometry;
    } catch (err) {
      console.error("Geometry parse error:", err);
      return null;
    }
  }, [feature]);

  
  const polygonPositions = useMemo(() => {
    if (!geometry?.coordinates) return [];

    const coords = geometry.coordinates;

    if (geometry.type === "Polygon") {
      return coords?.[0]?.map(([lng, lat]: number[]) => [lat, lng]) || [];
    }

    if (geometry.type === "MultiPolygon") {
      return coords?.[0]?.[0]?.map(([lng, lat]: number[]) => [lat, lng]) || [];
    }

    return [];
  }, [geometry]);

  
  if (!selectedUser) {
    return (
      <div className="page-content">
        <Card>
          <CardBody>
            <h5>Please select a user</h5>
          </CardBody>
        </Card>
      </div>
    );
  }

  
  if (!polygonPositions.length) {
    return (
      <div className="page-content">
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <h5>No location found for this user</h5>
              <Button color="secondary" onClick={() => setSelectedUser(null)}>
                Back
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Card>
        <CardBody>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>{selectedUser?.userName}</h5>
            <Button color="secondary" onClick={() => setSelectedUser(null)}>
              Back
            </Button>
          </div>

          {/* Map */}
          <MapContainer
            center={polygonPositions[0]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Polygon
              positions={polygonPositions}
              pathOptions={{
                color: "blue",
                fillColor: "lightblue",
                fillOpacity: 0.5,
              }}
            >
              <Popup>{selectedUser?.userName}</Popup>
            </Polygon>
          </MapContainer>
        </CardBody>
      </Card>
    </div>
  );
};

export default Location;