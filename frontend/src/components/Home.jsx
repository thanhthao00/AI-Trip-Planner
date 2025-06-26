import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8001/api/blogs/")
      .then((response) => {
        setBlogs(response.data.blogs); 
      })
      .catch((error) => {
        console.error("Failed to fetch blogs:", error);
      });
  }, []);

  return (
    <div className="Home">
      <h1>Welcome to Trip Planner!</h1>
      <h2>Ready to explore the world<br />But don’t know where to start?</h2>
      <p>
        Let us craft your dream trip in seconds.<br />
        Just tell us where you’re going and your budget<br />
        And we’ll build a personalized travel itinerary just for you.
      </p>

      <div className="button-container">
        <button onClick={() => navigate("/tripplanner")}>
          Create a new trip
        </button>
      </div>

      <div className="blog-section">
        <h1>🌍 Travel Blogs</h1>
        <div className="blog-grid">
          {blogs.length > 0 ? (
          blogs.map((blog, index) => (
          <div key={index} className="blog-card">
            <h3>{blog.title}</h3>
            <div className="blog-meta">
              <span className="blog-date">{new Date(blog.time).toLocaleDateString()}</span>
              <span className="blog-author">{blog.author || "Unknown"}</span>
            </div>
            <br />
            <p1>{blog.description}</p1>
            <br />
            <a href={blog.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
          ))
          ) : (
          <p>...Loading blog posts...</p>
        )}
        </div>
      </div>

    </div>
  );
}
