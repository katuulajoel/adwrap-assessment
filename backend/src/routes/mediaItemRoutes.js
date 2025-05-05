const express = require('express');
const mediaItemController = require('../controllers/mediaItemController');

const router = express.Router();

// GET /api/media-items
router.get('/', mediaItemController.getAllMediaItems);

// GET /api/media-items/:id
router.get('/:id', mediaItemController.getMediaItemById);

// GET /api/media-items/workspace/:workspaceId
router.get('/workspace/:workspaceId', mediaItemController.getMediaItemsByWorkspace);

// POST /api/media-items/workspace/:workspaceId/billboard
router.post('/workspace/:workspaceId/billboard', mediaItemController.createBillboard);

// POST /api/media-items/workspace/:workspaceId/streetpole
router.post('/workspace/:workspaceId/streetpole', mediaItemController.createStreetPole);

// PUT /api/media-items/:id
router.put('/:id', mediaItemController.updateMediaItem);

// DELETE /api/media-items/:id
router.delete('/:id', mediaItemController.deleteMediaItem);

module.exports = router;