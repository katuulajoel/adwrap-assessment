const express = require('express');
const workspaceController = require('../controllers/workspaceController');

const router = express.Router();

// GET /api/workspaces
router.get('/', workspaceController.getWorkspaces);

// GET /api/workspaces/:id
router.get('/:id', workspaceController.getWorkspaceById);

// POST /api/workspaces
router.post('/', workspaceController.createWorkspace);

// PUT /api/workspaces/:id
router.put('/:id', workspaceController.updateWorkspace);

// DELETE /api/workspaces/:id
router.delete('/:id', workspaceController.deleteWorkspace);

module.exports = router;