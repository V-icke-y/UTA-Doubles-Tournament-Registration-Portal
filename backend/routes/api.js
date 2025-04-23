const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Projectpass1',
  database: process.env.DB_NAME || 'uta_tournament'
};

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Register new player
router.post('/register', async (req, res) => {
  console.log('Received registration request:', req.body);
  console.log('Database config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database
  });
  
  const connection = await mysql.createConnection(dbConfig);
  try {
    const {
      name, whatsappNumber, dateOfBirth, city,
      shirtSize, shortSize, foodPref, stayYorN,
      feePaid, event1, partner1, event2, partner2
    } = req.body;

    console.log('Processing registration for:', {
      name, event1, partner1, event2, partner2
    });

    // Check if player already exists
    const [existingPlayer] = await connection.execute(
      'SELECT id FROM tbl_players WHERE name = ?',
      [name]
    );

    let playerId;
    if (existingPlayer.length > 0) {
      // Update existing player
      playerId = existingPlayer[0].id;
      await connection.execute(
        'UPDATE tbl_players SET whatsappNumber = ?, dateOfBirth = ?, city = ?, shirtSize = ?, shortSize = ?, foodPref = ?, stayYorN = ?, feePaid = ? WHERE id = ?',
        [whatsappNumber, dateOfBirth, city, shirtSize, shortSize, foodPref, stayYorN, feePaid, playerId]
      );
    } else {
      // Insert new player
      const [result] = await connection.execute(
        'INSERT INTO tbl_players (name, whatsappNumber, dateOfBirth, city, shirtSize, shortSize, foodPref, stayYorN, feePaid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, whatsappNumber, dateOfBirth, city, shirtSize, shortSize, foodPref, stayYorN, feePaid]
      );
      playerId = result.insertId;
    }

    console.log('Player processed successfully, ID:', playerId);

    // Get partner IDs
    let partner1Id = null;
    let partner2Id = null;

    if (partner1 && partner1 !== 'Partner not registered yet') {
      const [partner1Rows] = await connection.execute(
        'SELECT id FROM tbl_players WHERE name = ?',
        [partner1]
      );
      if (partner1Rows.length > 0) {
        partner1Id = partner1Rows[0].id;
      }
    }

    if (partner2 && partner2 !== 'Partner not registered yet') {
      const [partner2Rows] = await connection.execute(
        'SELECT id FROM tbl_players WHERE name = ?',
        [partner2]
      );
      if (partner2Rows.length > 0) {
        partner2Id = partner2Rows[0].id;
      }
    }

    // Handle event 1 registration
    if (event1) {
      console.log('Processing Event 1:', event1);
      // Check if entry already exists
      const [existingEntry] = await connection.execute(
        'SELECT id FROM tbl_partners WHERE userId = ? AND eventName = ?',
        [playerId, event1]
      );

      if (existingEntry.length > 0) {
        // Update existing entry
        await connection.execute(
          'UPDATE tbl_partners SET partnerId = ? WHERE userId = ? AND eventName = ?',
          [partner1Id, playerId, event1]
        );
      } else {
        // Insert new entry
        await connection.execute(
          'INSERT INTO tbl_partners (eventName, userId, partnerId) VALUES (?, ?, ?)',
          [event1, playerId, partner1Id]
        );
      }

      // If partner exists, create/update the reverse relationship
      if (partner1Id) {
        const [existingReverseEntry] = await connection.execute(
          'SELECT id FROM tbl_partners WHERE userId = ? AND eventName = ?',
          [partner1Id, event1]
        );

        if (existingReverseEntry.length > 0) {
          await connection.execute(
            'UPDATE tbl_partners SET partnerId = ? WHERE userId = ? AND eventName = ?',
            [playerId, partner1Id, event1]
          );
        } else {
          await connection.execute(
            'INSERT INTO tbl_partners (eventName, userId, partnerId) VALUES (?, ?, ?)',
            [event1, partner1Id, playerId]
          );
        }
      }
    }

    // Handle event 2 registration
    if (event2) {
      console.log('Processing Event 2:', event2);
      // Check if entry already exists
      const [existingEntry] = await connection.execute(
        'SELECT id FROM tbl_partners WHERE userId = ? AND eventName = ?',
        [playerId, event2]
      );

      if (existingEntry.length > 0) {
        // Update existing entry
        await connection.execute(
          'UPDATE tbl_partners SET partnerId = ? WHERE userId = ? AND eventName = ?',
          [partner2Id, playerId, event2]
        );
      } else {
        // Insert new entry
        await connection.execute(
          'INSERT INTO tbl_partners (eventName, userId, partnerId) VALUES (?, ?, ?)',
          [event2, playerId, partner2Id]
        );
      }

      // If partner exists, create/update the reverse relationship
      if (partner2Id) {
        const [existingReverseEntry] = await connection.execute(
          'SELECT id FROM tbl_partners WHERE userId = ? AND eventName = ?',
          [partner2Id, event2]
        );

        if (existingReverseEntry.length > 0) {
          await connection.execute(
            'UPDATE tbl_partners SET partnerId = ? WHERE userId = ? AND eventName = ?',
            [playerId, partner2Id, event2]
          );
        } else {
          await connection.execute(
            'INSERT INTO tbl_partners (eventName, userId, partnerId) VALUES (?, ?, ?)',
            [event2, partner2Id, playerId]
          );
        }
      }
    }

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration', error: error.message });
  } finally {
    await connection.end();
  }
});

// User login
router.post('/user-login', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const { whatsappNumber, dateOfBirth } = req.body;

    const [rows] = await connection.execute(
      'SELECT * FROM tbl_players WHERE whatsappNumber = ? AND dateOfBirth = ?',
      [whatsappNumber, dateOfBirth]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userData = rows[0];
    
    // Get player's events and partners
    const [events] = await connection.execute(`
      SELECT tp.*, p.name as partnerName 
      FROM tbl_partners tp 
      LEFT JOIN tbl_players p ON tp.partnerId = p.id 
      WHERE tp.userId = ?
    `, [userData.id]);

    // Format events data
    const formattedEvents = events.reduce((acc, event) => {
      if (event.eventName === 'Event 1') {
        acc.event1 = event.eventName;
        acc.partner1 = event.partnerName;
      } else if (event.eventName === 'Event 2') {
        acc.event2 = event.eventName;
        acc.partner2 = event.partnerName;
      }
      return acc;
    }, {});

    res.json({
      ...userData,
      ...formattedEvents
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  } finally {
    await connection.end();
  }
});

// Admin login
router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  // Verify against environment variables
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ adminId: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get pairs for an event
router.get('/pairs/:event', verifyAdminToken, async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const { event } = req.params;

    const [rows] = await connection.execute(`
      SELECT DISTINCT
        p1.name as player1Name,
        p2.name as player2Name,
        tp.ranking,
        tp.userId,
        tp.partnerId,
        p1.whatsappNumber as player1WhatsApp,
        p2.whatsappNumber as player2WhatsApp,
        p1.dateOfBirth as player1DOB,
        p2.dateOfBirth as player2DOB,
        p1.city as player1City,
        p2.city as player2City,
        p1.shirtSize as player1ShirtSize,
        p2.shirtSize as player2ShirtSize,
        p1.shortSize as player1ShortSize,
        p2.shortSize as player2ShortSize,
        p1.foodPref as player1FoodPref,
        p2.foodPref as player2FoodPref,
        p1.stayYorN as player1Stay,
        p2.stayYorN as player2Stay,
        p1.feePaid as player1FeePaid,
        p2.feePaid as player2FeePaid
      FROM tbl_partners tp
      JOIN tbl_players p1 ON tp.userId = p1.id
      LEFT JOIN tbl_players p2 ON tp.partnerId = p2.id
      WHERE tp.eventName = ?
      ORDER BY tp.ranking IS NULL, tp.ranking
    `, [event]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching pairs:', error);
    res.status(500).json({ message: 'Error fetching pairs' });
  } finally {
    await connection.end();
  }
});

// Update rankings
router.post('/update-rankings', verifyAdminToken, async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const { event, pairs } = req.body;

    for (const pair of pairs) {
      await connection.execute(
        'UPDATE tbl_partners SET ranking = ? WHERE eventName = ? AND userId = ?',
        [pair.ranking, event, pair.userId]
      );
    }

    res.json({ message: 'Rankings updated successfully' });
  } catch (error) {
    console.error('Error updating rankings:', error);
    res.status(500).json({ message: 'Error updating rankings' });
  } finally {
    await connection.end();
  }
});

// Get all players
router.get('/players', verifyAdminToken, async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [players] = await connection.execute(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT tp.eventName) as events
      FROM tbl_players p
      LEFT JOIN tbl_partners tp ON p.id = tp.userId
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error fetching players' });
  } finally {
    await connection.end();
  }
});

// Get players by event
router.get('/players-by-event/:event', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const { event } = req.params;
    const [players] = await connection.execute(`
      SELECT DISTINCT p.id, p.name
      FROM tbl_players p
      JOIN tbl_partners tp ON p.id = tp.userId AND tp.eventName = ?
      WHERE tp.partnerId IS NULL
      ORDER BY p.name
    `, [event]);

    res.json(players);
  } catch (error) {
    console.error('Error fetching players by event:', error);
    res.status(500).json({ message: 'Error fetching players' });
  } finally {
    await connection.end();
  }
});

// Delete player
router.delete('/players/:id', verifyAdminToken, async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const { id } = req.params;

    // First delete from tbl_partners to handle foreign key constraints
    await connection.execute(
      'DELETE FROM tbl_partners WHERE userId = ? OR partnerId = ?',
      [id, id]
    );

    // Then delete from tbl_players
    const [result] = await connection.execute(
      'DELETE FROM tbl_players WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ message: 'Error deleting player', error: error.message });
  } finally {
    await connection.end();
  }
});

// Update event names in database
router.post('/update-event-names', verifyAdminToken, async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    // Update event names in tbl_partners
    await connection.execute(`
      UPDATE tbl_partners 
      SET eventName = CASE 
        WHEN eventName = "Men's Doubles" THEN "Event A"
        WHEN eventName = "Women's Doubles" THEN "Event B"
        WHEN eventName = "Mixed Doubles" THEN "Event C"
        WHEN eventName = "Senior Doubles" THEN "Event D"
        WHEN eventName = "Junior Doubles" THEN "Event E"
        ELSE eventName
      END
    `);

    res.json({ message: 'Event names updated successfully' });
  } catch (error) {
    console.error('Error updating event names:', error);
    res.status(500).json({ message: 'Error updating event names' });
  } finally {
    await connection.end();
  }
});

module.exports = router; 