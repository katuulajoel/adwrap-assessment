-- ==========================
-- 001_create_tables.sql
-- ==========================

-- Create enums
CREATE TYPE media_type AS ENUM ('static', 'streetpole');
CREATE TYPE availability_status AS ENUM ('Available', 'Booked');

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    location VARCHAR(255)
);

-- Media Items table
CREATE TABLE IF NOT EXISTS media_items (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    type media_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    tracking_id VARCHAR(20) UNIQUE NOT NULL,
    location VARCHAR(255),
    closest_landmark VARCHAR(255),
    availability availability_status DEFAULT 'Available',
    format VARCHAR(50), -- for static billboards (e.g., standard, unipole)
    number_of_faces INTEGER, -- for static billboards
    number_of_street_poles INTEGER, -- for street poles
    side_routes JSONB, -- array of routes (for street poles)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Static Media Faces table
CREATE TABLE IF NOT EXISTS static_media_faces (
    id SERIAL PRIMARY KEY,
    media_item_id INTEGER NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    description TEXT,
    dimensions VARCHAR(100),
    availability availability_status DEFAULT 'Available',
    rent DECIMAL(10, 2),
    images JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    media_item_id INTEGER NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    route_name VARCHAR(255) NOT NULL,
    side_route VARCHAR(50),
    description TEXT,
    distance DECIMAL(10, 2),
    number_of_street_poles INTEGER DEFAULT 0,
    price_per_street_pole DECIMAL(10, 2),
    images JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspace counters (for tracking IDs)
CREATE TABLE IF NOT EXISTS workspace_counters (
    workspace_id INTEGER PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
    static_count INTEGER DEFAULT 0,
    streetpole_count INTEGER DEFAULT 0
);

-- Trigger function to auto-generate tracking_id
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TRIGGER AS $$
DECLARE
    counter_value INTEGER;
    prefix VARCHAR(3);
    existing_count INTEGER;
    new_tracking_id VARCHAR(20);
    is_unique BOOLEAN := FALSE;
BEGIN
    IF NEW.type = 'static' THEN
        prefix := 'BB-';
        
        -- Get current count
        SELECT static_count INTO counter_value
        FROM workspace_counters
        WHERE workspace_id = NEW.workspace_id;
        
        -- Create workspace_counters record if it doesn't exist
        IF counter_value IS NULL THEN
            INSERT INTO workspace_counters (workspace_id, static_count, streetpole_count)
            VALUES (NEW.workspace_id, 0, 0);
            counter_value := 0;
        END IF;
        
        -- Find a unique tracking ID
        WHILE is_unique = FALSE LOOP
            counter_value := counter_value + 1;
            new_tracking_id := prefix || counter_value;
            
            SELECT COUNT(*) INTO existing_count
            FROM media_items
            WHERE tracking_id = new_tracking_id;
            
            is_unique := (existing_count = 0);
        END LOOP;
        
        -- Update the counter
        UPDATE workspace_counters 
        SET static_count = counter_value 
        WHERE workspace_id = NEW.workspace_id;
        
    ELSE
        prefix := 'SP-';
        
        -- Get current count
        SELECT streetpole_count INTO counter_value
        FROM workspace_counters
        WHERE workspace_id = NEW.workspace_id;
        
        -- Create workspace_counters record if it doesn't exist
        IF counter_value IS NULL THEN
            INSERT INTO workspace_counters (workspace_id, static_count, streetpole_count)
            VALUES (NEW.workspace_id, 0, 0);
            counter_value := 0;
        END IF;
        
        -- Find a unique tracking ID
        WHILE is_unique = FALSE LOOP
            counter_value := counter_value + 1;
            new_tracking_id := prefix || counter_value;
            
            SELECT COUNT(*) INTO existing_count
            FROM media_items
            WHERE tracking_id = new_tracking_id;
            
            is_unique := (existing_count = 0);
        END LOOP;
        
        -- Update the counter
        UPDATE workspace_counters 
        SET streetpole_count = counter_value 
        WHERE workspace_id = NEW.workspace_id;
    END IF;

    NEW.tracking_id := new_tracking_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on media_items
DROP TRIGGER IF EXISTS before_media_item_insert ON media_items;
CREATE TRIGGER before_media_item_insert
    BEFORE INSERT ON media_items
    FOR EACH ROW
    EXECUTE FUNCTION generate_tracking_id();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_workspace ON media_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_faces_media_item ON static_media_faces(media_item_id);
CREATE INDEX IF NOT EXISTS idx_routes_media_item ON routes(media_item_id);
CREATE INDEX IF NOT EXISTS idx_static_faces_images ON static_media_faces USING GIN (images);
CREATE INDEX IF NOT EXISTS idx_routes_images ON routes USING GIN (images);

-- Materialized Views: media_faces_summary
CREATE MATERIALIZED VIEW IF NOT EXISTS media_faces_summary AS
SELECT
    w.id AS workspace_id,
    w.name AS workspace_name,
    m.id AS media_item_id,
    m.name AS media_item_name,
    m.tracking_id,
    f.id AS face_id,
    f.description,
    f.dimensions,
    f.availability,
    f.rent,
    f.images
FROM media_items m
JOIN static_media_faces f ON m.id = f.media_item_id
JOIN workspaces w ON w.id = m.workspace_id;

-- Materialized Views: media_routes_summary
CREATE MATERIALIZED VIEW IF NOT EXISTS media_routes_summary AS
SELECT
    w.id AS workspace_id,
    w.name AS workspace_name,
    m.id AS media_item_id,
    m.name AS media_item_name,
    m.tracking_id,
    r.id AS route_id,
    r.route_name,
    r.side_route,
    r.description,
    r.distance,
    r.number_of_street_poles,
    r.price_per_street_pole,
    r.images
FROM media_items m
JOIN routes r ON m.id = r.media_item_id
JOIN workspaces w ON w.id = m.workspace_id;