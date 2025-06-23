import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="Home">
      <h1>Welcome to Trip Planner!</h1>
      <h2>Ready to explore the world<br/>But don’t know where to start?</h2>
      <p>Let us craft your dream trip in seconds.<br/> 
      Just tell us where you’re going and your budget
      <br/>And we’ll build a personalized travel itinerary just for you. </p>
      <div className="button-container">
        <button onClick={() => navigate("/tripplanner")}>
          <img src="/ticket.png" alt="Logo" />
          Create a new trip
        </button>
      </div>
    </div>
  );
}
