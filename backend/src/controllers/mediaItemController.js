const MediaItem = require('../models/mediaItem');

// Get all media items
exports.getAllMediaItems = async (req, res) => {
  try {
    const mediaItems = await MediaItem.getAll();
    res.json(mediaItems);
  } catch (error) {
    console.error('Error fetching media items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get media items by workspace ID
exports.getMediaItemsByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const mediaItems = await MediaItem.getByWorkspace(workspaceId);
    res.json(mediaItems);
  } catch (error) {
    console.error(`Error fetching media items for workspace ${req.params.workspaceId}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get media item by ID with related data (faces or routes)
exports.getMediaItemById = async (req, res) => {
  try {
    const mediaItem = await MediaItem.getWithRelatedData(req.params.id);
    
    if (!mediaItem) {
      return res.status(404).json({ message: 'Media item not found' });
    }
    
    res.json(mediaItem);
  } catch (error) {
    console.error(`Error fetching media item with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new billboard with faces
exports.createBillboard = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const billboardData = req.body;
    
    if (!billboardData.name) {
      return res.status(400).json({ message: 'Billboard name is required' });
    }
    
    const billboard = await MediaItem.createBillboard(workspaceId, billboardData);
    res.status(201).json(billboard);
  } catch (error) {
    console.error('Error creating billboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new street pole with routes
exports.createStreetPole = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const streetPoleData = req.body;
    
    if (!streetPoleData.name) {
      return res.status(400).json({ message: 'Street pole name is required' });
    }
    
    const streetPole = await MediaItem.createStreetPole(workspaceId, streetPoleData);
    res.status(201).json(streetPole);
  } catch (error) {
    console.error('Error creating street pole:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a media item
exports.updateMediaItem = async (req, res) => {
  try {
    const { id } = req.params;
    const mediaItemData = req.body;
    
    if (!mediaItemData.name) {
      return res.status(400).json({ message: 'Media item name is required' });
    }
    
    const updatedMediaItem = await MediaItem.update(id, mediaItemData);
    
    if (!updatedMediaItem) {
      return res.status(404).json({ message: 'Media item not found' });
    }
    
    res.json(updatedMediaItem);
  } catch (error) {
    console.error(`Error updating media item with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a media item
exports.deleteMediaItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MediaItem.delete(id);
    
    res.json({ message: 'Media item deleted successfully' });
  } catch (error) {
    console.error(`Error deleting media item with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};