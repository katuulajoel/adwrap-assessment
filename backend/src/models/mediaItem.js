const db = require('../config/db');

class MediaItem {
  // Get all media items
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM media_items ORDER BY created_at DESC');
    return rows;
  }

  // Get media items by workspace ID
  static async getByWorkspace(workspaceId) {
    const { rows } = await db.query('SELECT * FROM media_items WHERE workspace_id = $1 ORDER BY created_at DESC', [workspaceId]);
    return rows;
  }

  // Get a single media item by ID
  static async getById(id) {
    const { rows } = await db.query('SELECT * FROM media_items WHERE id = $1', [id]);
    return rows[0];
  }

  // Create a new billboard with faces
  static async createBillboard(workspaceId, data) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert the billboard media item
      const { name, format, location, closest_landmark, availability } = data;
      const { rows: mediaRows } = await client.query(
        `INSERT INTO media_items 
        (workspace_id, type, name, format, location, closest_landmark, availability, number_of_faces) 
        VALUES ($1, 'billboard', $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [workspaceId, name, format, location, closest_landmark, availability || 'Available', data.faces?.length || 0]
      );
      
      const mediaItem = mediaRows[0];
      
      // Insert all faces if provided
      if (data.faces && data.faces.length > 0) {
        for (const face of data.faces) {
          await client.query(
            `INSERT INTO static_media_faces 
            (media_item_id, face_name, description, dimensions, availability, rent, images) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              mediaItem.id, 
              face.face_name,
              face.description, 
              face.dimensions, 
              face.availability || 'Available',
              face.rent,
              face.images || []
            ]
          );
        }
      }
      
      // Commit transaction
      await client.query('COMMIT');
      
      return mediaItem;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Create a new street pole with routes
  static async createStreetPole(workspaceId, data) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert the street pole media item
      const { name, location, closest_landmark, availability, number_of_street_poles } = data;
      const { rows: mediaRows } = await client.query(
        `INSERT INTO media_items 
        (workspace_id, type, name, location, closest_landmark, availability, number_of_street_poles) 
        VALUES ($1, 'street_pole', $2, $3, $4, $5, $6) 
        RETURNING *`,
        [workspaceId, name, location, closest_landmark, availability || 'Available', number_of_street_poles || 0]
      );
      
      const mediaItem = mediaRows[0];
      
      // Insert all routes if provided
      if (data.routes && data.routes.length > 0) {
        for (const route of data.routes) {
          await client.query(
            `INSERT INTO routes 
            (media_item_id, route_name, side_route, description, distance, number_of_street_poles, price_per_street_pole, images) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              mediaItem.id, 
              route.route_name,
              route.side_route, 
              route.description, 
              route.distance,
              route.number_of_street_poles,
              route.price_per_street_pole,
              route.images || []
            ]
          );
        }
      }
      
      // Commit transaction
      await client.query('COMMIT');
      
      return mediaItem;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get media item with related data (faces or routes)
  static async getWithRelatedData(id) {
    const client = await db.pool.connect();
    
    try {
      const { rows: media } = await client.query(
        'SELECT * FROM media_items WHERE id = $1', 
        [id]
      );
      
      if (!media.length) {
        return null;
      }
      
      const mediaItem = media[0];
      
      if (mediaItem.type === 'billboard') {
        // Get faces for billboard
        const { rows: faces } = await client.query(
          'SELECT * FROM static_media_faces WHERE media_item_id = $1',
          [mediaItem.id]
        );
        
        mediaItem.faces = faces;
      } else {
        // Get routes for street pole
        const { rows: routes } = await client.query(
          'SELECT * FROM routes WHERE media_item_id = $1',
          [mediaItem.id]
        );
        
        mediaItem.routes = routes;
      }
      
      return mediaItem;
    } finally {
      client.release();
    }
  }

  // Update a media item
  static async update(id, data) {
    const { rows } = await db.query(
      `UPDATE media_items 
       SET name = $1, location = $2, closest_landmark = $3, availability = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [data.name, data.location, data.closest_landmark, data.availability, id]
    );
    
    return rows[0];
  }

  // Delete a media item and its related data
  static async delete(id) {
    await db.query('DELETE FROM media_items WHERE id = $1', [id]);
    return { id };
  }
}

module.exports = MediaItem;