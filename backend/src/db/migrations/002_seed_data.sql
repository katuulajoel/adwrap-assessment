-- ==========================
-- 002_seed_data.sql
-- ==========================

-- Insert Workspaces
INSERT INTO workspaces (id, name, email, address, location)
VALUES
(1, 'Ogilvy Outdoor', 'info@ogilvyoutdoor.com', '12 Herbert Macaulay Way, Yaba', 'Lagos Mainland'),
(2, 'Proactive Media', 'contact@proactive.ng', 'Plot 14 Wuse Zone 5', 'Abuja')
ON CONFLICT (id) DO NOTHING;

-- Insert Static Media Item (id=1)
INSERT INTO media_items (id, workspace_id, type, name, location, closest_landmark, availability, format, number_of_faces)
VALUES
(1, 1, 'static', 'Iyana Oworo Billboard', 'Iyana Oworo, Lagos', 'Third Mainland Bridge', 'Available', 'standard', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert Faces for Static Media Item 1
INSERT INTO static_media_faces (id, media_item_id, description, availability, images, rent)
VALUES
(101, 1, 'Facing traffic towards Island', 'Available', '["https://example.com/billboard-1a.jpg"]', 50000),
(102, 1, 'Facing Mainland', 'Booked', '["https://example.com/billboard-1b.jpg"]', 45000)
ON CONFLICT (id) DO NOTHING;

-- Insert Street Pole Media Item (id=2)
INSERT INTO media_items (id, workspace_id, type, name, location, closest_landmark, availability, number_of_street_poles, side_routes)
VALUES
(2, 2, 'streetpole', 'Aminu Kano Crescent Street Pole', 'Aminu Kano Crescent, Abuja', 'Wuse Market', 'Available', 3, '["North", "South"]')
ON CONFLICT (id) DO NOTHING;

-- Insert Routes for Street Pole Item 2
INSERT INTO routes (id, media_item_id, route_name, side_route, description, number_of_street_poles, price_per_street_pole, images)
VALUES
(201, 2, 'Towards Berger Junction', 'North', 'Route along Berger Junction', 2, 25000, '["https://example.com/streetpole-1a.jpg"]'),
(202, 2, 'Back toward Banex Plaza', 'South', 'Route back to Banex Plaza', 1, 20000, '["https://example.com/streetpole-1b.jpg"]')
ON CONFLICT (id) DO NOTHING;

-- Initialize workspace counters for tracking IDs
INSERT INTO workspace_counters (workspace_id, static_count, streetpole_count)
VALUES 
(1, 1, 0),  -- Workspace 1 has one static billboard (BB-1)
(2, 0, 1)   -- Workspace 2 has one street pole (SP-1)
ON CONFLICT (workspace_id) DO UPDATE 
SET static_count = GREATEST(workspace_counters.static_count, EXCLUDED.static_count),
    streetpole_count = GREATEST(workspace_counters.streetpole_count, EXCLUDED.streetpole_count);

-- Reset sequences to continue from the highest IDs
SELECT setval('workspaces_id_seq', (SELECT MAX(id) FROM workspaces));
SELECT setval('media_items_id_seq', (SELECT MAX(id) FROM media_items));
SELECT setval('static_media_faces_id_seq', (SELECT MAX(id) FROM static_media_faces));
SELECT setval('routes_id_seq', (SELECT MAX(id) FROM routes));

-- Refresh Materialized Views
REFRESH MATERIALIZED VIEW media_faces_summary;
REFRESH MATERIALIZED VIEW media_routes_summary;