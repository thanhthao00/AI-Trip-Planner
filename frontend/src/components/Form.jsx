import React from 'react';

function Form({ formData, handleChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <input name="destination" placeholder="Destination" onChange={handleChange} value={formData.destination} /><br/>
      <input name="days" placeholder="Days" type="number" onChange={handleChange} value={formData.days} /><br/>
      <input name="interests" placeholder="Interests (e.g., culture, food, hiking)" onChange={handleChange} value={formData.interests} /><br/>
      <input name="budget" placeholder="Budget (low, medium, high)" onChange={handleChange} value={formData.budget} /><br/>
      <button type="submit">Generate Itinerary</button>
    </form>
  );
}

export default Form;
