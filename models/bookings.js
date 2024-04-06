const mysql = require('mysql2/promise');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'R@ruwaida3',
  database: 'saassignment'
};

// Using pool for efficient connection management
const pool = mysql.createPool(dbConfig);

/////////////////////// COMMAND PATTERN

class Command {
  async execute() {
    throw new Error('Method execute() must be implemented');
  }
}

class TrackEventCommand extends Command {
  constructor(eventData) {
    super();
    this.eventData = eventData;
  }

  async execute() {
    const sql = 'INSERT INTO Events (user_id, event_date, location, attendees) VALUES (?, ?, ?, ?)';
    const values = [this.eventData.user_id, this.eventData.event_date, this.eventData.location, this.eventData.attendees];
    try {
      const [result] = await pool.query(sql, values);
      console.log('Event tracked successfully', result);
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }
}

class EventTracker {
  constructor() {
    this.command = null;
  }

  setCommand(command) {
    this.command = command;
  }

  async trackEvent() {
    if (this.command) {
      await this.command.execute();
    }
  }
}

////////////// OBSERVER PATTERN

class EventModel {
  constructor() {
      this.observers = [];
  }

  subscribe(observer) {
      this.observers.push(observer);
  }

  unsubscribe(observer) {
      this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers(eventData) {
      for (const observer of this.observers) {
          observer.update(eventData);
      }
  }

  async deleteEvent(eventId) {
      try {
          await deleteEventById(eventId);
          this.notifyObservers({ eventId, action: 'deleted' });
      } catch (error) {
          console.error('Error deleting event:', error);
      }
  }

  static async getEventsByUserId(userId) {
      const sql = 'SELECT * FROM Events WHERE user_id = ?';
      try {
          const [events] = await pool.query(sql, [userId]);
          return events;
      } catch (error) {
          console.error('Error getting events:', error);
          throw error;
      }
  }
}
async function deleteEventById(eventId) {
  const sql = 'DELETE FROM Events WHERE event_id = ?';
  try {
      const [result] = await pool.query(sql, [eventId]);
      console.log(`Event with ID ${eventId} deleted from the database.`);
      return result;
  } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
  }
}

module.exports = { EventTracker, TrackEventCommand, EventModel };