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
            (media_item_id, description, availability, rent, image) 
            VALUES ($1, $2, $3, $4, $5)`,
            [
              mediaItem.id,
              face.description,
              face.availability || 'Available',
              face.rent,
              face.image || null,
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
            (media_item_id, route_name, side_route, description, price_per_street_pole, image) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              mediaItem.id,
              route.route_name,
              route.side_route,
              route.description,
              route.price_per_street_pole,
              route.image || null,
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
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // Update the main media item
      let updateQuery = `
        UPDATE media_items 
        SET name = $1, 
            location = $2, 
            closest_landmark = $3, 
            availability = $4,
      `;

      const params = [data.name, data.location, data.closest_landmark, data.availability];
      let paramCount = 5;

      if (data.type === 'billboard') {
        updateQuery += `
            format = $${paramCount},
        `;
        params.push(data.format);
        paramCount += 1;
      }

      updateQuery += `
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramCount} 
        RETURNING *
      `;

      params.push(id);
      const { rows } = await client.query(updateQuery, params);
      const updatedMediaItem = rows[0];

      // Update faces
      if (data.faces) {
        const existingFaceIds = data.faces.filter(face => face.id).map(face => face.id);

        // Delete faces not in the new data
        if (existingFaceIds.length > 0) {
          const placeholders = existingFaceIds.map((_, index) => `$${index + 2}`).join(', ');
          await client.query(
            `DELETE FROM static_media_faces WHERE media_item_id = $1 AND id NOT IN (${placeholders})`,
            [id, ...existingFaceIds]
          );
        } else {
          await client.query('DELETE FROM static_media_faces WHERE media_item_id = $1', [id]);
        }

        // Upsert faces
        for (const face of data.faces) {
          if (face.id) {
            await client.query(
              `UPDATE static_media_faces 
               SET description = $1, availability = $2, rent = $3, image = $4, updated_at = CURRENT_TIMESTAMP 
               WHERE id = $5`,
              [face.description, face.availability, face.rent, face.image, face.id]
            );
          } else {
            await client.query(
              `INSERT INTO static_media_faces (media_item_id, description, availability, rent, image, created_at, updated_at) 
               VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
              [id, face.description, face.availability, face.rent, face.image]
            );
          }
        }
      }

      // Update routes
      if (data.routes) {
        const existingRouteIds = data.routes.filter(route => route.id).map(route => route.id);

        // Delete routes not in the new data
        if (existingRouteIds.length > 0) {
          const placeholders = existingRouteIds.map((_, index) => `$${index + 2}`).join(', ');
          await client.query(
            `DELETE FROM routes WHERE media_item_id = $1 AND id NOT IN (${placeholders})`,
            [id, ...existingRouteIds]
          );
        } else {
          await client.query('DELETE FROM routes WHERE media_item_id = $1', [id]);
        }

        // Upsert routes
        for (const route of data.routes) {
          if (route.id) {
            // Update existing route
            await client.query(
              `UPDATE routes 
               SET route_name = $1, side_route = $2, description = $3, price_per_street_pole = $4, image = $5, updated_at = CURRENT_TIMESTAMP 
               WHERE id = $6`,
              [
                route.route_name,
                route.side_route,
                route.description,
                route.price_per_street_pole,
                route.image,
                route.id,
              ]
            );
          } else {
            // Insert new route
            await client.query(
              `INSERT INTO routes (media_item_id, route_name, side_route, description, price_per_street_pole, image, created_at, updated_at) 
               VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
              [
                id,
                route.route_name,
                route.side_route,
                route.description,
                route.price_per_street_pole,
                route.image,
              ]
            );
          }
        }
      }

      await client.query('COMMIT');
      return updatedMediaItem;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete a media item and its related data
  static async delete(id) {
    await db.query('DELETE FROM media_items WHERE id = $1', [id]);
    return { id };
  }
}

module.exports = MediaItem;
