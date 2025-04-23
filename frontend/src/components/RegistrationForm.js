import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegistrationForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [event1Players, setEvent1Players] = useState([]);
  const [event2Players, setEvent2Players] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    dateOfBirth: '',
    city: '',
    shirtSize: '',
    shortSize: '',
    foodPref: '',
    stayYorN: '',
    feePaid: false,
    event1: '',
    partner1: '',
    event2: '',
    partner2: ''
  });

  useEffect(() => {
    // Check for pre-filled data from user login
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        name: parsedData.name || '',
        whatsappNumber: parsedData.whatsappNumber || '',
        dateOfBirth: parsedData.dateOfBirth || '',
        city: parsedData.city || '',
        shirtSize: parsedData.shirtSize || '',
        shortSize: parsedData.shortSize || '',
        foodPref: parsedData.foodPref || '',
        stayYorN: parsedData.stayYorN || '',
        feePaid: parsedData.feePaid || false,
        event1: parsedData.event1 || '',
        partner1: parsedData.partner1 || '',
        event2: parsedData.event2 || '',
        partner2: parsedData.partner2 || ''
      }));

      // Fetch players for pre-selected events
      if (parsedData.event1) {
        fetchPlayersByEvent(parsedData.event1, setEvent1Players);
      }
      if (parsedData.event2) {
        fetchPlayersByEvent(parsedData.event2, setEvent2Players);
      }

      // Clear the stored data after using it
      localStorage.removeItem('userData');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Fetch players when event is selected
    if (name === 'event1' && value) {
      fetchPlayersByEvent(value, setEvent1Players);
    } else if (name === 'event2' && value) {
      fetchPlayersByEvent(value, setEvent2Players);
    }
  };

  const fetchPlayersByEvent = async (event, setPlayers) => {
    try {
      const response = await fetch(`http://localhost:3001/api/players-by-event/${encodeURIComponent(event)}`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.name || !formData.whatsappNumber || !formData.dateOfBirth || 
        !formData.city || !formData.shirtSize || !formData.shortSize || 
        !formData.foodPref || !formData.stayYorN) {
      alert('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      console.log('Registration successful:', data);
      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Tournament Registration</h2>
      
      {step === 1 ? (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">Step 1: General Details</h3>
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">WhatsApp Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Shirt Size</label>
                  <select
                    className="form-select"
                    name="shirtSize"
                    value={formData.shirtSize}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Short Size</label>
                  <select
                    className="form-select"
                    name="shortSize"
                    value={formData.shortSize}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Food Preference</label>
                <select
                  className="form-select"
                  name="foodPref"
                  value={formData.foodPref}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Preference</option>
                  <option value="Veg">Vegetarian</option>
                  <option value="NonVeg">Non-Vegetarian</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Need Accommodation?</label>
                <select
                  className="form-select"
                  name="stayYorN"
                  value={formData.stayYorN}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Option</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="feePaid"
                  checked={formData.feePaid}
                  onChange={handleInputChange}
                  id="feePaid"
                />
                <label className="form-check-label" htmlFor="feePaid">
                  Registration Fee Paid
                </label>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">Step 2: Event & Partner Selection</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Event 1</label>
                <select
                  className="form-select"
                  name="event1"
                  value={formData.event1}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Event</option>
                  <option value="Event A">Event A</option>
                  <option value="Event B">Event B</option>
                  <option value="Event C">Event C</option>
                  <option value="Event D">Event D</option>
                  <option value="Event E">Event E</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Partner 1</label>
                <select
                  className="form-select"
                  name="partner1"
                  value={formData.partner1}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Partner</option>
                  <option value="Partner not registered yet">Partner not registered yet</option>
                  {event1Players.map(player => (
                    <option key={player.id} value={player.name}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Event 2 (Optional)</label>
                <select
                  className="form-select"
                  name="event2"
                  value={formData.event2}
                  onChange={handleInputChange}
                >
                  <option value="">Select Event</option>
                  <option value="Event A">Event A</option>
                  <option value="Event B">Event B</option>
                  <option value="Event C">Event C</option>
                  <option value="Event D">Event D</option>
                  <option value="Event E">Event E</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Partner 2 (Optional)</label>
                <select
                  className="form-select"
                  name="partner2"
                  value={formData.partner2}
                  onChange={handleInputChange}
                >
                  <option value="">Select Partner</option>
                  <option value="Partner not registered yet">Partner not registered yet</option>
                  {event2Players.map(player => (
                    <option key={player.id} value={player.name}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationForm; 