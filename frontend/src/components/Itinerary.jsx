import React from 'react';

function Itinerary({ itinerary }) {
  if (!itinerary) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Generated Itinerary:</h2>
      <p>{itinerary}</p>
    </div>
  );
}

export default Itinerary;
