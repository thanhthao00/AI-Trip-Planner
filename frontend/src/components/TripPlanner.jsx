import "./TripPlanner.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const activityOptions = [
  "Beaches", "City sightseeing", "Outdoor adventures",
  "Festivals", "Food exploration", "Nightlife",
  "Shopping", "Spa wellness", "Historical landmarks"
];

const getSavedData = () => {
  try {
    const saved = localStorage.getItem("tripForm");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export default function TripPlanner() {
  const navigate = useNavigate();
  const saved = getSavedData();

  const [destination, setDestination] = useState(saved.destination || "");
  const [startDate, setStartDate] = useState(saved.startDate || "");
  const [days, setDays] = useState(saved.days || "");
  const [budget, setBudget] = useState(saved.budget || "");
  const [preferences, setPreferences] = useState(saved.preferences || []);
  const [travelCompanion, setTravelCompanion] = useState(saved.travelCompanion || "");

  useEffect(() => {
    localStorage.setItem("tripForm", JSON.stringify({
      destination,
      startDate,
      days,
      budget,
      preferences,
      travelCompanion
    }));
  }, [destination, startDate, days, budget, preferences, travelCompanion]);

  const togglePreference = (activity) => {
    setPreferences((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
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

      navigate("/itinerary", { state: { itinerary: response.data.itinerary } });
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
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate} min={today} onChange={(e) => setStartDate(e.target.value)} />
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

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit">Generate Itinerary</button>
        </div>
      </form>
    </div>
  );
}
