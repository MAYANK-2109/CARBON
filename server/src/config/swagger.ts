/**
 * @module config/swagger
 * @description OpenAPI 3.0 documentation setup using swagger-jsdoc + swagger-ui-express.
 * Accessible in development at GET /api/docs
 */
import { Express } from 'express';

/** Inline OpenAPI spec — no swagger-jsdoc package required */
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Carbon Footprint Assistant API',
    version: '1.0.0',
    description: 'REST API for tracking, calculating, and reducing your carbon footprint.',
    contact: { name: 'Carbon Team' },
  },
  servers: [
    { url: '/api/v1', description: 'Current version' },
    { url: '/api',    description: 'Legacy (backward-compat)' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'accessToken' },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success:   { type: 'boolean' },
          data:      { type: 'object' },
          message:   { type: 'string' },
          requestId: { type: 'string' },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success:   { type: 'boolean', example: false },
          message:   { type: 'string' },
          requestId: { type: 'string' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field:   { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: { '200': { description: 'Server is healthy' } },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name:     { type: 'string' },
                  email:    { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Account created' },
          '409': { description: 'Email already registered' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email:    { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Authenticated' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/tips': {
      get: {
        tags: ['Tips'],
        summary: 'Get reduction tips',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['travel', 'energy', 'diet', 'general'] } },
          { name: 'limit',    in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'List of tips' } },
      },
    },
    '/api/calculate': {
      post: {
        tags: ['Calculator'],
        summary: 'Calculate carbon emissions',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': { description: 'Emission breakdown' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
};

/**
 * Mount Swagger UI at /api/docs (development only).
 * Requires `swagger-ui-express` to be installed: npm install swagger-ui-express -w server
 */
export function setupSwagger(app: Express): void {
  // Dynamically import so it's only loaded when needed
  // To enable: npm install swagger-ui-express @types/swagger-ui-express -w server
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
    const swaggerUi = require('swagger-ui-express') as any;
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Carbon API Docs',
    }));
    console.log('📖 API docs available at /api/docs');
  } catch {
    // swagger-ui-express not installed — skip silently
  }
}

export { swaggerSpec };
