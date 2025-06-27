import { useLocation, useNavigate } from "react-router-dom";
import MapContainer from "./Map";
import "./TripPlanner.css";


export default function ItineraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const itinerary = location.state?.itinerary;

  if (!itinerary) {
    return (
      <div>
        <h2>No itinerary found.</h2>
        <button onClick={() => navigate("/")}>Back to planner</button>
      </div>
    );
  }

  return (
    <div className="itinerary">
      <h2>Itinerary for {itinerary.destination}</h2>
      <p>Days: {itinerary.days}</p>
      <p>Budget: ${itinerary.budget}</p>
      <p>Preferences: {itinerary.preferences}</p>
      <p>Travel Companion: {itinerary.companion}</p>
      <h3>Suggested Activities:</h3>
      <ul>
        {itinerary.activities.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
      <p>Suggested Budget: {itinerary.suggested_budget}</p>
      <MapContainer locations={itinerary?.locations || []} center={itinerary.center} />
    </div>
  );
}
