import { useState } from "react";
import axios from "axios";
import MapContainer from "./Map";

export default function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");
  const [itinerary, setItinerary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/generate-itinerary/", {
        destination,
        days: parseInt(days),
        budget: parseInt(budget),
        preferences,
      });
      setItinerary(response.data.itinerary);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error generating itinerary", error);
    }
  };

  return (
    <div className="App">
      <h1>Personalized Travel Itinerary Builder</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Destination:</label>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </div>
        <div>
          <label>Days:</label>
          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} />
        </div>
        <div>
          <label>Budget:</label>
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
        <div>
          <label>Preferences:</label>
          <input type="text" value={preferences} onChange={(e) => setPreferences(e.target.value)} />
        </div>
        <button type="submit">Generate Itinerary</button>
      </form>

      {itinerary && (
        <div className="itinerary">
          <h2>Itinerary for {itinerary.destination}</h2>
          <p>Days: {itinerary.days}</p>
          <p>Budget: ${itinerary.budget}</p>
          <p>Preferences: {itinerary.preferences}</p>
          <h3>Suggested Activities:</h3>
          <ul>
            {itinerary.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
          <p>Suggested Budget: {itinerary.suggested_budget}</p>
          <MapContainer locations={itinerary?.locations || []} center={itinerary.center} />
        </div>
      )}
    </div>
  );
}
