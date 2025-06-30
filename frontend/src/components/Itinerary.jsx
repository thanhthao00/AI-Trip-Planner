import "./Itinerary.css";
import { useLocation } from "react-router-dom";
import MapContainer from "./Map";
import { useEffect, useState } from "react";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = "Myr7t_b0P08uNbjw-zuZiBdp66RuCw8K9YPX7OC1a9s";

export default function Itinerary() {
  const location = useLocation();
  const itinerary = location.state?.itinerary;
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      if (!itinerary?.destination) return;
      try {
        const response = await axios.get("https://api.unsplash.com/search/photos", {
          params: {
            query: itinerary.destination,
            per_page: 5,
            orientation: "landscape",
          },
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        });

        const image = response.data.results.find((img) => img.width > img.height);
        if (image?.urls?.regular) {
          setImageUrl(image.urls.regular);
        }
      } catch (error) {
        console.error("Error fetching Unsplash image:", error);
      }
    };

    fetchImage();
  }, [itinerary]);

  const startDateObj = new Date(itinerary.startdate);
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(startDateObj.getDate() + Number(itinerary.days));

  const formattedStartDate = startDateObj.toLocaleDateString("en-GB");
  const formattedEndDate = endDateObj.toLocaleDateString("en-GB");

  return (
    <div className="itinerary-container">
      <div className="itinerary-left">
        <h1>{itinerary.destination}</h1>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={itinerary.destination}
            className="destination-image"
          />
        )}

        <h2><strong>🗓️ {formattedStartDate} - {formattedEndDate}</strong> </h2>
        <p><strong>Budget:</strong> ${itinerary.budget}</p>
        <p><strong>Companion:</strong> {itinerary.companion}</p>
        <p><strong>Preferences:</strong> {itinerary.preferences}</p>

        <h3>Activities</h3>
        <ul>
          {itinerary.activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>

        <p><strong>Suggested Budget:</strong> {itinerary.suggested_budget}</p>
      </div>

      <div className="itinerary-right">
        <MapContainer
          locations={itinerary.locations || []}
          center={itinerary.center}
        />
      </div>
    </div>
  );
}
