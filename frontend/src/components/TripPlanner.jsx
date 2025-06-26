import "./TripPlanner.css";
import { useState } from "react";
import axios from "axios";
import MapContainer from "./Map";

const activityOptions = [
  "Beaches", "City sightseeing", "Outdoor adventures",
  "Festivals/events", "Food exploration", "Nightlife",
  "Shopping", "Spa wellness"
];

export default function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [travelCompanion, setTravelCompanion] = useState("");
  const [itinerary, setItinerary] = useState(null);

  const togglePreference = (activity) => {
    if (preferences.includes(activity)) {
      setPreferences(preferences.filter((a) => a !== activity));
    } else {
      setPreferences([...preferences, activity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/generate-itinerary/", {
        destination,
        start_date: startDate,
        days: parseInt(days),
        budget: parseInt(budget),
        preferences: preferences.join(", "),
        companion: travelCompanion,
      });

      setItinerary(response.data.itinerary);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error generating itinerary:", error.response?.data || error.message);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="TripPlanner">
      <h1>Ready to explore?</h1>
      <h2>Let’s create a travel plan that’s just right for you—simple, fast, and fun!</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div>
          <label>What is your destination of choice?</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>Days:</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>
        <div>
          <label>Budget:</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div>
          <label>Which activities are you interested in?</label>
          <div className="activity-grid">
            {activityOptions.map((activity) => (
              <div
                key={activity}
                className={`activity-option ${preferences.includes(activity) ? "selected" : ""}`}
                onClick={() => togglePreference(activity)}
              >
                {activity}
              </div>
            ))}
          </div>
        </div>

        <div className="companion-section">
          <label>Who do you plan on traveling with on your next adventure?</label>
          <div className="companion-options">
            {["solo", "couple", "family", "friends"].map((option) => (
              <div
                key={option}
                className={`companion-card ${travelCompanion === option ? "selected" : ""}`}
                onClick={() => setTravelCompanion(option)}
              >
                <img src={`/public/${option}.png`} alt={option} />
                <span className="label">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Generate Itinerary</button>
      </form>

      {itinerary && (
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
      )}
    </div>
  );
}
