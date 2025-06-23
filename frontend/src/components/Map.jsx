import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

// Subcomponent to update map view when center changes
const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 12); // Smooth transition
      // map.setView([center.lat, center.lng], 12); // Instant change (alternative)
    }
  }, [center, map]);

  return null;
};

const MapComponent = ({ locations, center }) => {
  if (!center) return null; // Avoid rendering if center is not defined

  return (
    <div>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ height: "50vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater center={center} />
        {locations.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lng]}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
