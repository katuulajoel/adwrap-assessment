const db = require('../config/db');

class Workspace {
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM workspaces');
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query('SELECT * FROM workspaces WHERE id = $1', [id]);
    return rows[0];
  }

  static async create(workspace) {
    const { name, email, address, location } = workspace;
    
    const { rows } = await db.query(
      'INSERT INTO workspaces (name, email, address, location) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, location]
    );
    
    return rows[0];
  }

  static async update(id, workspace) {
    const { name, email, address, location } = workspace;
    
    const { rows } = await db.query(
      'UPDATE workspaces SET name = $1, email = $2, address = $3, location = $4 WHERE id = $5 RETURNING *',
      [name, email, address, location, id]
    );
    
    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM workspaces WHERE id = $1', [id]);
    return { id };
  }
}

module.exports = Workspace;