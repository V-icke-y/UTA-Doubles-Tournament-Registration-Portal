import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const navigate = useNavigate();
  
  const tournamentInfo = [
    "Annual doubles tennis tournament organized by Uttaranchal Tennis Association (UTA)",
    "1) Categories : A (Open), B (90+ combined), C (105+ combined), D (120+ combined), Lucky Doubles. This is Only Doubles Tournament.",
    "Lucky Doubles Format - Any participant who loses both the matches in the first round shall be considered for the draw of Lucky Doubles. Any participant who opted for one event and loses in the first round will also be eligible. Pairing up logic will be as follows: All the participants will be divided into X(Age<=50 years) and Y(Age>50 years) categories. Each pair will have one person from X category and one person from Y category  based on lottery system.",
    "Age Limit is 30 years.",
    "The age of any participant shall be calculated as his running age as on 9th December. For example if the participant turns 29 on the 8th December, he can be considered as 30. PLease carry your age proof with you.",
    "One player can participate in max 2 categories (excluding lucky doubles which could be the 3rd for any participant). ",
    "Coaches are allowed to play in Category A only. Any Individual who earns via tennis coaching shall be defined as Coach.",
    "Entry Fee for two events is 4500 (6000 with double sharing accommodation of up to 2 days) and one event is 3000 (4500 with double sharing accommodation of up to 2 days).",
    "Breakfast and Lunch shall be provided on both days and Gala dinner on the 9th December.",
    "Every participant shall get Indian Tree T-Shirt, Shorts, Socks, Cap, Wristband (MRP more than Rs 3000).",
    "Prize money for the winner team is 21000 and for the runners up team is 11000. Each Semi-Finalist team shall get 4000. Lucky Doubles Prize shall be 50% (10500 for winner, 5500 for runner up, 2000 each for SF). ",
    "Last date for entry Fees is 7th December.",
    "No entry fees shall at all be accepted after 7th December.",
    "Draws and Order of Play shall be published on the 8th December.",
    "If any team does not turn up at scheduled time, walk-over shall be given to the opponent within 15 minutes.",
    "Balls for the Tournament shall be Head Tour.",
    "For any query Please contact Tournament Director Sumit Goel (Ph. 9412977857)",
    "Venue of the tournament - Shanti Tennis Academy, https://maps.app.goo.gl/fPLo9aK52WSihktY6",
    "Venue for Gala Party and Stay - OM farms, 8-A, Jogiwala, Badripur, Dehradun, Uttarakhand 248005",
    "The Maximum size of the draw in any category is 32.",
    " There are 4 hard courts and 4 additional hard courts at a nearby venue if required.",
    "After registration, do join the participants whatsapp group through the link below. https://chat.whatsapp.com/JTvbjXSOolF7KI5ORr46DY "
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">UTA Doubles Tennis Tournament</h1>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <button 
            className="btn btn-primary btn-lg btn-block w-100" 
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
        <div className="col-md-4">
          <button 
            className="btn btn-success btn-lg btn-block w-100" 
            onClick={() => navigate('/user-login')}
          >
            User Login
          </button>
        </div>
        <div className="col-md-4">
          <button 
            className="btn btn-info btn-lg btn-block w-100" 
            onClick={() => navigate('/admin-login')}
          >
            Admin Login
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Tournament Information</h2>
          <ul className="list-group list-group-flush">
            {tournamentInfo.map((info, index) => (
              <li key={index} className="list-group-item">{info}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 