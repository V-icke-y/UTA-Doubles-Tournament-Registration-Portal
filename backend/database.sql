CREATE DATABASE IF NOT EXISTS uta_tournament;
USE uta_tournament;

CREATE TABLE IF NOT EXISTS tbl_eventName (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    whatsappNumber VARCHAR(20) NOT NULL,
    dateOfBirth DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    shirtSize VARCHAR(10) NOT NULL,
    shortSize VARCHAR(10) NOT NULL,
    foodPref VARCHAR(50) NOT NULL,
    stayYorN CHAR(1) NOT NULL,
    feePaid BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_whatsapp (whatsappNumber)
);

CREATE TABLE IF NOT EXISTS tbl_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL,
    userId INT NOT NULL,
    partnerId INT,
    ranking INT,
    FOREIGN KEY (userId) REFERENCES tbl_players(id),
    FOREIGN KEY (partnerId) REFERENCES tbl_players(id)
);

-- Insert default event names
INSERT INTO tbl_eventName (eventName) VALUES
    ('Men\'s Doubles'),
    ('Women\'s Doubles'),
    ('Mixed Doubles'),
    ('Senior Doubles'),
    ('Junior Doubles');

-- Create players table
CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    uta_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    player1_id INT NOT NULL,
    player2_id INT NOT NULL,
    division VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1_id) REFERENCES players(id),
    FOREIGN KEY (player2_id) REFERENCES players(id)
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (team_id) REFERENCES teams(id)
); 