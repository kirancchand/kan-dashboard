import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody, CardHeader, Input } from 'reactstrap';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for leaflet marker icon missing in production
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ bounds }: { bounds: L.LatLngBounds | null }) => {
    const map = useMap();
    if (bounds) {
        map.fitBounds(bounds, { padding: [20, 20] });
    }
    return null;
};

const DeliveryMap = () => {
    document.title = "Delivery Map | Velzon - React Admin & Dashboard Template";

    const [districts, setDistricts] = useState<any[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    
    const [panchayaths, setPanchayaths] = useState<any[]>([]);
    const [selectedPanchayath, setSelectedPanchayath] = useState<any>(null);
    const [panchayathGeoJsonData, setPanchayathGeoJsonData] = useState<any>(null);

    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await fetch('/district');
                const result = await response.json();
                if (result.status === 200 && result.data) {
                    setDistricts(result.data);
                }
            } catch (error) {
                console.error("Error fetching districts", error);
            }
        };
        
        const fetchPanchayaths = async () => {
            try {
                const response = await fetch('/panchaythu.txt');
                const result = await response.json();
                if (result.status === 200 && result.data) {
                    setPanchayaths(result.data);
                }
            } catch (error) {
                console.error("Error fetching panchayaths", error);
            }
        };

        fetchDistricts();
        fetchPanchayaths();
    }, []);

    const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const distId = parseInt(e.target.value);
        if (!distId) {
            setSelectedDistrict(null);
            setGeoJsonData(null);
            if (!panchayathGeoJsonData) setMapBounds(null);
            return;
        }

        const district = districts.find(d => d.district_id === distId);
        setSelectedDistrict(district);

        if (district && district.geometry) {
            try {
                const parsedGeometry = JSON.parse(district.geometry);
                const feature = {
                    type: "Feature",
                    properties: { name: district.district },
                    geometry: parsedGeometry
                };
                setGeoJsonData(feature);
                
                // Calculate bounds to focus the map
                const geoJsonLayer = L.geoJSON(feature as any);
                setMapBounds(geoJsonLayer.getBounds());
            } catch (error) {
                console.error("Error parsing geometry", error);
            }
        }
    };

    const handlePanchayathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const areaId = parseInt(e.target.value);
        if (!areaId) {
            setSelectedPanchayath(null);
            setPanchayathGeoJsonData(null);
            if (!geoJsonData) setMapBounds(null);
            return;
        }

        const panchayath = panchayaths.find(p => p.area_id === areaId);
        setSelectedPanchayath(panchayath);

        if (panchayath && panchayath.geometry) {
            try {
                const parsedGeometry = JSON.parse(panchayath.geometry);
                const feature = {
                    type: "Feature",
                    properties: { name: panchayath.area },
                    geometry: parsedGeometry
                };
                setPanchayathGeoJsonData(feature);
                
                // Calculate bounds to focus the map
                const geoJsonLayer = L.geoJSON(feature as any);
                setMapBounds(geoJsonLayer.getBounds());
            } catch (error) {
                console.error("Error parsing geometry", error);
            }
        }
    };

    // Default position, Kerala
    const defaultPosition: [number, number] = [10.8505, 76.2711];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Card>
                        <CardHeader className="d-flex align-items-center">
                            <h4 className="card-title mb-0 flex-grow-1">Live Tracking Map</h4>
                            <div className="flex-shrink-0 d-flex gap-2" style={{ minWidth: '250px' }}>
                                <Input type="select" onChange={handleDistrictChange}>
                                    <option value="">Select District</option>
                                    {districts.map(d => (
                                        <option key={d.district_id} value={d.district_id}>{d.district}</option>
                                    ))}
                                </Input>
                                <Input type="select" onChange={handlePanchayathChange}>
                                    <option value="">Select Panchayath</option>
                                    {panchayaths.map(p => (
                                        <option key={p.area_id} value={p.area_id}>{p.area}</option>
                                    ))}
                                </Input>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div style={{ height: "500px", width: "100%" }}>
                                <MapContainer center={defaultPosition} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {geoJsonData && (
                                        <GeoJSON 
                                            key={`district-${selectedDistrict?.district_id}`} 
                                            data={geoJsonData} 
                                            style={{
                                                fillColor: '#405189',
                                                weight: 2,
                                                opacity: 1,
                                                color: 'white',
                                                dashArray: '3',
                                                fillOpacity: 0.7
                                            }}
                                        />
                                    )}
                                    {panchayathGeoJsonData && (
                                        <GeoJSON 
                                            key={`panchayath-${selectedPanchayath?.area_id}`} 
                                            data={panchayathGeoJsonData} 
                                            style={{
                                                fillColor: '#0ab39c',
                                                weight: 2,
                                                opacity: 1,
                                                color: 'white',
                                                dashArray: '3',
                                                fillOpacity: 0.7
                                            }}
                                        />
                                    )}
                                    {mapBounds && <ChangeView bounds={mapBounds} />}
                                </MapContainer>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DeliveryMap;
