const db = require('../config/db');

class MediaItem {
  // Get all media items
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM media_items ORDER BY created_at DESC');
    return rows;
  }

  // Get media items by workspace ID
  static async getByWorkspace(workspaceId) {
    const { rows } = await db.query(
      'SELECT * FROM media_items WHERE workspace_id = $1 ORDER BY created_at DESC',
      [workspaceId]
    );
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
        (workspace_id, type, name, format, location, closest_landmark, availability) 
        VALUES ($1, 'static', $2, $3, $4, $5, $6) 
        RETURNING *`,
        [workspaceId, name, format, location, closest_landmark, availability || 'Available']
      );

      const mediaItem = mediaRows[0];

      // Insert all faces if provided
      if (data.faces && data.faces.length > 0) {
        for (const face of data.faces) {
          await client.query(
            `INSERT INTO static_media_faces 
            (media_item_id, description, availability, rent, images) 
            VALUES ($1, $2, $3, $4, $5)`,
            [
              mediaItem.id,
              face.description,
              face.availability || 'Available',
              face.rent,
              face.images || [],
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
      const { name, location, closest_landmark, availability } = data;
      const { rows: mediaRows } = await client.query(
        `INSERT INTO media_items 
        (workspace_id, type, name, location, closest_landmark, availability) 
        VALUES ($1, 'streetpole', $2, $3, $4, $5) 
        RETURNING *`,
        [workspaceId, name, location, closest_landmark, availability || 'Available']
      );

      const mediaItem = mediaRows[0];

      // Insert all routes if provided
      if (data.routes && data.routes.length > 0) {
        for (const route of data.routes) {
          await client.query(
            `INSERT INTO routes 
            (media_item_id, route_name, side_route, description, price_per_street_pole, images) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              mediaItem.id,
              route.route_name,
              route.side_route,
              route.description,
              route.price_per_street_pole,
              route.images || [],
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
      const { rows: media } = await client.query('SELECT * FROM media_items WHERE id = $1', [id]);

      if (!media.length) {
        return null;
      }

      const mediaItem = media[0];

      // Map database type to frontend type
      if (mediaItem.type === 'static') {
        mediaItem.type = 'billboard';

        // Get faces for billboard
        const { rows: faces } = await client.query(
          'SELECT * FROM static_media_faces WHERE media_item_id = $1',
          [mediaItem.id]
        );

        mediaItem.faces = faces;
      } else if (mediaItem.type === 'streetpole') {
        mediaItem.type = 'street_pole';

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
    // Add fields based on media type
    let updateQuery = `
      UPDATE media_items 
      SET name = $1, 
          location = $2, 
          closest_landmark = $3, 
          availability = $4,
    `;

    const params = [data.name, data.location, data.closest_landmark, data.availability];
    let paramCount = 4;

    // If billboard type, update billboard-specific fields
    if (data.type === 'billboard') {
      updateQuery += `
          format = $${paramCount},
      `;
      params.push(data.format);
      paramCount += 1;
    }

    // Add the last part of the query
    updateQuery += `
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    params.push(id);

    const { rows } = await db.query(updateQuery, params);
    return rows[0];
  }

  // Delete a media item and its related data
  static async delete(id) {
    await db.query('DELETE FROM media_items WHERE id = $1', [id]);
    return { id };
  }
}

module.exports = MediaItem;
