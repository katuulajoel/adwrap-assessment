const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ADWrap Media Management API',
    version: '1.0.0',
    description: 'API documentation for ADWrap Media Management System',
    contact: {
      name: 'API Support',
      email: 'support@adwrap.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Workspaces',
      description: 'Workspace management',
    },
    {
      name: 'Media Items',
      description: 'Media items management (billboards and street poles)',
    },
  ],
  components: {
    schemas: {
      Workspace: {
        type: 'object',
        required: ['name'],
        properties: {
          id: {
            type: 'integer',
            description: 'Workspace ID',
          },
          name: {
            type: 'string',
            description: 'Workspace name',
          },
          email: {
            type: 'string',
            description: 'Contact email',
          },
          address: {
            type: 'string',
            description: 'Workspace address',
          },
          location: {
            type: 'string',
            description: 'Workspace location',
          },
        },
      },
      MediaItem: {
        type: 'object',
        required: ['workspace_id', 'type', 'name'],
        properties: {
          id: {
            type: 'integer',
            description: 'Media item ID',
          },
          workspace_id: {
            type: 'integer',
            description: 'Workspace ID this media item belongs to',
          },
          type: {
            type: 'string',
            enum: ['billboard', 'street_pole'],
            description: 'Type of media item',
          },
          name: {
            type: 'string',
            description: 'Name of the media item',
          },
          tracking_id: {
            type: 'string',
            description: 'Tracking ID (e.g., BB-1, SP-1)',
          },
          location: {
            type: 'string',
            description: 'Location of the media item',
          },
          closest_landmark: {
            type: 'string',
            description: 'Closest landmark to the media item',
          },
          availability: {
            type: 'string',
            description: 'Availability status',
          },
        },
      },
      StaticMediaFace: {
        type: 'object',
        required: ['media_item_id'],
        properties: {
          id: {
            type: 'integer',
            description: 'Face ID',
          },
          media_item_id: {
            type: 'integer',
            description: 'Media item ID this face belongs to',
          },
          description: {
            type: 'string',
            description: 'Description of the face',
          },
          availability: {
            type: 'string',
            description: 'Availability status',
          },
          rent: {
            type: 'number',
            description: 'Rental price',
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Images of the face',
          },
        },
      },
      Route: {
        type: 'object',
        required: ['media_item_id', 'route_name'],
        properties: {
          id: {
            type: 'integer',
            description: 'Route ID',
          },
          media_item_id: {
            type: 'integer',
            description: 'Media item ID this route belongs to',
          },
          route_name: {
            type: 'string',
            description: 'Name of the route',
          },
          description: {
            type: 'string',
            description: 'Description of the route',
          },
          price_per_street_pole: {
            type: 'number',
            description: 'Price per street pole',
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Images of the route',
          },
        },
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
