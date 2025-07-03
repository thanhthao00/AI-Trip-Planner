import "./Itinerary.css";
import { useLocation } from "react-router-dom";
import MapContainer from "./Map";
import { useEffect, useState } from "react";
import axios from "axios";
import HotelSlider from "./Hotel";
import RestaurantSlider from "./Restaurant";

const UNSPLASH_ACCESS_KEY = "";
const WIKIPEDIA_API = "https://en.wikipedia.org/api/rest_v1/page/summary/";

export default function Itinerary() {
  const location = useLocation();
  const itinerary = location.state?.itinerary;
  const [destinationImage, setDestinationImage] = useState("");
  const [locationImages, setLocationImages] = useState({});
  const [locationDescriptions, setLocationDescriptions] = useState({});
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (!itinerary?.destination) return;

    const fetchImagesAndDescriptions = async () => {
      try {
        const destRes = await axios.get("https://api.unsplash.com/search/photos", {
          params: { query: itinerary.destination, per_page: 5, orientation: "landscape" },
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        });
        const destImg = destRes.data.results.find((img) => img.width > img.height);
        if (destImg?.urls?.regular) {
          setDestinationImage(destImg.urls.regular);
        }

        const promises = itinerary.locations.map(async (loc) => {
          const [imageRes, descRes] = await Promise.all([
            axios.get("https://api.unsplash.com/search/photos", {
              params: { query: loc.name, per_page: 1, orientation: "landscape" },
              headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
            }),
            axios.get(`${WIKIPEDIA_API}${encodeURIComponent(loc.name)}`).catch(() => ({
              data: { extract: "" },
            })),
          ]);

          const imageUrl = imageRes.data.results[0]?.urls?.small || "";
          const description = descRes.data.extract?.split(".")[0] + "." || "";

          return { name: loc.name, imageUrl, description };
        });

        const results = await Promise.all(promises);
        const imagesMap = {};
        const descriptionsMap = {};
        results.forEach(({ name, imageUrl, description }) => {
          if (imageUrl) imagesMap[name] = imageUrl;
          if (description) descriptionsMap[name] = description;
        });

        setLocationImages(imagesMap);
        setLocationDescriptions(descriptionsMap);
      } catch (error) {
        console.error("Error fetching images or descriptions:", error);
      }
    };

    const fetchHotels = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/hotel-recommendation/", {
          destination: itinerary.destination,
          budget: itinerary.budget,
          companion: itinerary.companion,
        });
        setHotels(response.data.hotels || []);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      }
    };

    const fetchRestaurants = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/restaurant-recommendation/", {
          destination: itinerary.destination,
          budget: itinerary.budget,
          companion: itinerary.companion,
        });
        setRestaurants(response.data.restaurants || []);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchImagesAndDescriptions();
    fetchHotels();
    fetchRestaurants();
  }, [itinerary]);

  if (!itinerary) return <div>No itinerary data available.</div>;

  const startDateObj = new Date(itinerary.startdate);
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(startDateObj.getDate() + Number(itinerary.days));
  const formattedStartDate = startDateObj.toLocaleDateString("en-GB");
  const formattedEndDate = endDateObj.toLocaleDateString("en-GB");

  return (
    <div className="itinerary-wrapper">
      <div className="itinerary-left">
        <h1>{itinerary.destination}</h1>
        <h1>{formattedStartDate} - {formattedEndDate}</h1>
        {destinationImage && (
          <img src={destinationImage} alt={itinerary.destination} className="destination-image" />
        )}

        <h2>Hotel Recommendation</h2>
        <div className="hotel-list">
          {hotels.length > 0 && <HotelSlider hotels={hotels} />}
        </div>

        <h2>Restaurant Recommendation</h2>
        <div className="hotel-list">
          {restaurants.length > 0 && <RestaurantSlider restaurants={restaurants} />}
        </div>

        <h2>Daily Itinerary</h2>
        {Array.from({ length: itinerary.days }, (_, dayIndex) => {
          const currentDate = new Date(startDateObj);
          currentDate.setDate(currentDate.getDate() + dayIndex);
          const formattedDate = currentDate.toLocaleDateString("en-GB");
          const dayLocations = itinerary.locations.slice(dayIndex * 2, dayIndex * 2 + 2);

          return (
            <div key={dayIndex} className="day-plan">
              <h3>Day {dayIndex + 1}: {formattedDate}</h3>
              {dayLocations.map((loc, idx) => (
                <div
                  key={idx}
                  className="location-card"
                  onClick={() =>
                    window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(loc.name)}`, "_blank")
                  }
                >
                  <div className="location-content">
                    <div className="location-text">
                      <h4>{loc.name}</h4>
                      <p>{locationDescriptions[loc.name] || "No description available."}</p>
                    </div>
                    {locationImages[loc.name] && (
                      <img src={locationImages[loc.name]} alt={loc.name} className="location-image" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="itinerary-right">
        <MapContainer locations={itinerary.locations || []} center={itinerary.center} />
      </div>
    </div>
  );
}
