import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import "./Hotel.css";

const UNSPLASH_ACCESS_KEY = "Myr7t_b0P08uNbjw-zuZiBdp66RuCw8K9YPX7OC1a9s";

const HotelSlider = ({ hotels }) => {
  const [loadedHotels, setLoadedHotels] = useState([]);

  const fetchImage = async (hotelName) => {
    try {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: `${hotelName} hotel`,
          per_page: 1,
          orientation: "landscape",
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      return res.data.results[0]?.urls?.regular || "/default-hotel.jpg";
    } catch (err) {
      console.error("Failed to fetch hotel image:", err);
      return "/default-hotel.jpg";
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const results = await Promise.all(
        hotels.map(async (hotel) => {
          const image = await fetchImage(hotel.name);
          return { ...hotel, image };
        })
      );
      setLoadedHotels(results);
    };

    if (hotels.length) loadImages();
  }, [hotels]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <div className="slick-arrow slick-next">›</div>,
    prevArrow: <div className="slick-arrow slick-prev">‹</div>,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="hotel-slider-wrapper">
      <Slider {...settings}>
        {loadedHotels.map((hotel, index) => (
          <div key={index} className="hotel-card">
            <a href={hotel.url} target="_blank" rel="noopener noreferrer">
              <img src={hotel.image} alt={hotel.name} className="hotel-image" />
            </a>
            <div className="hotel-info">
              <h4>{hotel.name}</h4>
              <div className="hotel-rating">
                <FaStar color="gold" />
                <span>{hotel.rating || "N/A"}</span>
              </div>
              <p><strong>${hotel.price_per_night || "--"}</strong> / night</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HotelSlider;
