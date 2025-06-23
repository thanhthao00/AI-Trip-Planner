import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import TripPlanner from "./components/TripPlanner";
import Promotion from "./components/Promotion";
import About from "./components/About";


function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tripplanner" element={<TripPlanner />} />
        <Route path="/promption" element={<Promotion />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
