import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserLogin() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    whatsappNumber: '',
    dateOfBirth: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      
      if (response.ok) {
        const data = await response.json();
        // Store user data in localStorage or state management
        localStorage.setItem('userData', JSON.stringify(data));
        navigate('/register'); // Navigate to pre-filled registration form
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      alert('Error logging in. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">User Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">WhatsApp Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="whatsappNumber"
                    value={loginData.whatsappNumber}
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
                    value={loginData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>

                <button
                  type="button"
                  className="btn btn-link w-100"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin; 