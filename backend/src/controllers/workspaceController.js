const Workspace = require('../models/workspace');

// Get all workspaces
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.getAll();
    res.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a workspace by ID
exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.getById(req.params.id);
    
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    res.json(workspace);
  } catch (error) {
    console.error(`Error fetching workspace with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { name, email, address, location } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }
    
    const newWorkspace = await Workspace.create({
      name,
      email, 
      address, 
      location
    });
    
    res.status(201).json(newWorkspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a workspace
exports.updateWorkspace = async (req, res) => {
  try {
    const { name, email, address, location } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }
    
    const updatedWorkspace = await Workspace.update(req.params.id, {
      name,
      email,
      address,
      location
    });
    
    if (!updatedWorkspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    res.json(updatedWorkspace);
  } catch (error) {
    console.error(`Error updating workspace with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const result = await Workspace.delete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    
    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error(`Error deleting workspace with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};