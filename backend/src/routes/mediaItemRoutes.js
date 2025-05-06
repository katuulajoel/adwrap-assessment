const express = require('express');
const mediaItemController = require('../controllers/mediaItemController');

const router = express.Router();

/**
 * @swagger
 * /api/media-items:
 *   get:
 *     summary: Get all media items
 *     tags: [Media Items]
 *     responses:
 *       200:
 *         description: List of all media items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MediaItem'
 *       500:
 *         description: Server error
 */
router.get('/', mediaItemController.getAllMediaItems);

/**
 * @swagger
 * /api/media-items/{id}:
 *   get:
 *     summary: Get media item by ID with related data
 *     tags: [Media Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Media Item ID
 *     responses:
 *       200:
 *         description: Media item details with faces or routes
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - allOf:
 *                     - $ref: '#/components/schemas/MediaItem'
 *                     - type: object
 *                       properties:
 *                         faces:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/StaticMediaFace'
 *                 - allOf:
 *                     - $ref: '#/components/schemas/MediaItem'
 *                     - type: object
 *                       properties:
 *                         routes:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Route'
 *       404:
 *         description: Media item not found
 *       500:
 *         description: Server error
 */
router.get('/:id', mediaItemController.getMediaItemById);

/**
 * @swagger
 * /api/media-items/workspace/{workspaceId}:
 *   get:
 *     summary: Get media items by workspace ID
 *     tags: [Media Items]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Workspace ID
 *     responses:
 *       200:
 *         description: List of media items in the specified workspace
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MediaItem'
 *       500:
 *         description: Server error
 */
router.get('/workspace/:workspaceId', mediaItemController.getMediaItemsByWorkspace);

/**
 * @swagger
 * /api/media-items/workspace/{workspaceId}/billboard:
 *   post:
 *     summary: Create a new billboard with faces
 *     tags: [Media Items]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               format:
 *                 type: string
 *               location:
 *                 type: string
 *               closest_landmark:
 *                 type: string
 *               availability:
 *                 type: string
 *               faces:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/StaticMediaFace'
 *     responses:
 *       201:
 *         description: Created billboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaItem'
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/workspace/:workspaceId/billboard', mediaItemController.createBillboard);

/**
 * @swagger
 * /api/media-items/workspace/{workspaceId}/streetpole:
 *   post:
 *     summary: Create a new street pole with routes
 *     tags: [Media Items]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               closest_landmark:
 *                 type: string
 *               availability:
 *                 type: string
 *               routes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Route'
 *     responses:
 *       201:
 *         description: Created street pole
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaItem'
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/workspace/:workspaceId/streetpole', mediaItemController.createStreetPole);

/**
 * @swagger
 * /api/media-items/{id}:
 *   put:
 *     summary: Update a media item
 *     tags: [Media Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Media Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               closest_landmark:
 *                 type: string
 *               availability:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated media item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaItem'
 *       400:
 *         description: Bad request - Missing required fields
 *       404:
 *         description: Media item not found
 *       500:
 *         description: Server error
 */
router.put('/:id', mediaItemController.updateMediaItem);

/**
 * @swagger
 * /api/media-items/{id}:
 *   delete:
 *     summary: Delete a media item
 *     tags: [Media Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Media Item ID
 *     responses:
 *       200:
 *         description: Media item deleted successfully
 *       404:
 *         description: Media item not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', mediaItemController.deleteMediaItem);

module.exports = router;
