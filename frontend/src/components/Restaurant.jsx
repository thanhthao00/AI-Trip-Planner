import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import "./Hotel.css";

const UNSPLASH_ACCESS_KEY = "Myr7t_b0P08uNbjw-zuZiBdp66RuCw8K9YPX7OC1a9s";

const RestaurantSlider = ({ restaurants }) => {
  const [loadedRestaurants, setLoadedRestaurants] = useState([]);

  const fetchImage = async (name) => {
    try {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: `${name} restaurant`,
          per_page: 1,
          orientation: "landscape",
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      return res.data.results[0]?.urls?.regular || "/default-restaurant.jpg";
    } catch (err) {
      console.error("Failed to fetch restaurant image:", err);
      return "/default-restaurant.jpg";
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const results = await Promise.all(
        restaurants.map(async (r) => {
          const image = await fetchImage(r.name);
          return { ...r, image };
        })
      );
      setLoadedRestaurants(results);
    };

    if (restaurants.length) loadImages();
  }, [restaurants]);

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
        {loadedRestaurants.map((r, idx) => (
          <div key={idx} className="hotel-card">
            <a href={r.url} target="_blank" rel="noopener noreferrer">
              <img src={r.image} alt={r.name} className="hotel-image" />
            </a>
            <div className="hotel-info">
              <h4>{r.name}</h4>
              <div className="hotel-rating">
                <FaStar color="gold" />
                <span>{r.rating || "N/A"}</span>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RestaurantSlider;
