import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    } else {
      fetchAllPlayers();
    }
  }, [navigate]);

  const fetchAllPlayers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/players', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      } else {
        alert('Error fetching players');
      }
    } catch (error) {
      alert('Error fetching players');
    } finally {
      setPlayersLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:3001/api/players/${playerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (response.ok) {
          alert('Player deleted successfully');
          // Refresh the players list
          fetchAllPlayers();
          // If we're viewing an event, refresh the pairs list
          if (selectedEvent) {
            handleEventChange({ target: { value: selectedEvent } });
          }
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error deleting player');
        }
      } catch (error) {
        alert('Error deleting player');
      }
    }
  };

  const handleEventChange = async (e) => {
    const event = e.target.value;
    setSelectedEvent(event);
    if (event) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/pairs/${event}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPairs(data);
        } else {
          alert('Error fetching pairs');
        }
      } catch (error) {
        alert('Error fetching pairs');
      }
      setLoading(false);
    }
  };

  const handleRankingChange = (index, value) => {
    const newPairs = [...pairs];
    newPairs[index].ranking = value;
    setPairs(newPairs);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/update-rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          event: selectedEvent,
          pairs: pairs
        })
      });
      
      if (response.ok) {
        alert('Rankings updated successfully!');
      } else {
        alert('Error updating rankings');
      }
    } catch (error) {
      alert('Error updating rankings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Event Selection and Rankings Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-4">
            <label className="form-label">Select Event</label>
            <select
              className="form-select"
              value={selectedEvent}
              onChange={handleEventChange}
            >
              <option value="">Choose event...</option>
              <option value="Event A">Event A</option>
              <option value="Event B">Event B</option>
              <option value="Event C">Event C</option>
              <option value="Event D">Event D</option>
              <option value="Event E">Event E</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : selectedEvent && pairs.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Player 1</th>
                    <th>Player 2</th>
                    <th>Ranking</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pairs.map((pair, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{pair.player1Name}</td>
                      <td>{pair.player2Name || 'Partner not registered yet'}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={pair.ranking || ''}
                          onChange={(e) => handleRankingChange(index, e.target.value)}
                          min="1"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletePlayer(pair.userId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Submit Rankings
              </button>
            </>
          ) : selectedEvent ? (
            <div className="text-center">No pairs found for this event.</div>
          ) : null}
        </div>
      </div>

      {/* All Players Section - Only show when no event is selected */}
      {!selectedEvent && (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">All Registered Players</h3>
            {playersLoading ? (
              <div className="text-center">Loading players...</div>
            ) : players.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>WhatsApp</th>
                      <th>Date of Birth</th>
                      <th>City</th>
                      <th>Shirt Size</th>
                      <th>Short Size</th>
                      <th>Food Preference</th>
                      <th>Accommodation</th>
                      <th>Fee Paid</th>
                      <th>Events</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <tr key={player.id}>
                        <td>{player.id}</td>
                        <td>{player.name}</td>
                        <td>{player.whatsappNumber}</td>
                        <td>{new Date(player.dateOfBirth).toLocaleDateString()}</td>
                        <td>{player.city}</td>
                        <td>{player.shirtSize}</td>
                        <td>{player.shortSize}</td>
                        <td>{player.foodPref}</td>
                        <td>{player.stayYorN === 'Y' ? 'Yes' : 'No'}</td>
                        <td>{player.feePaid ? 'Yes' : 'No'}</td>
                        <td>{player.events || 'None'}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeletePlayer(player.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center">No players registered yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 