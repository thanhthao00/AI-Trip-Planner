import "./Promotion.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Promotion() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [transportations, setTransportations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8001/api/hotels/")
      .then((response) => {
        setHotels(response.data.hotels);
      })
      .catch((error) => {
        console.error("Failed to fetch hotels:", error);
      });

    axios.get("http://localhost:8001/api/transportations/")
      .then((response) => {
        setTransportations(response.data.transportations);
      })
      .catch((error) => {
        console.error("Failed to fetch transportations:", error);
      });
  }, []);

  return (
    <div className="Promotion">
      <div className="blog-section">
        <h1>🏨 Hotel Promotions</h1>
        <div className="blog-grid">
          {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <div key={index} className="blog-card">
                <h3>{hotel.title}</h3>
                <div className="blog-meta">
                  <span className="blog-date">
                    {new Date(hotel.time).toLocaleDateString()}
                  </span>
                </div>
                <p>{hotel.description}</p>
                <a href={hotel.url} target="_blank" rel="noopener noreferrer">
                  View Deal
                </a>
              </div>
            ))
          ) : (
            <p>...Loading hotel promotions...</p>
          )}
        </div>
      </div>

      {/* Transportation Promotions */}
      <div className="blog-section">
        <h1>🚌 Transportation Promotions</h1>
        <div className="blog-grid">
          {transportations.length > 0 ? (
            transportations.map((trans, index) => (
              <div key={index} className="blog-card">
                <h3>{trans.title}</h3>
                <div className="blog-meta">
                  <span className="blog-date">
                    {new Date(trans.time).toLocaleDateString()}
                  </span>
                </div>
                <p>{trans.description}</p>
                <a href={trans.url} target="_blank" rel="noopener noreferrer">
                  View Deal
                </a>
              </div>
            ))
          ) : (
            <p>...Loading transport promotions...</p>
          )}
        </div>
      </div>
    </div>
  );
}
