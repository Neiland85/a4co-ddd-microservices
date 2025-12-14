import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  getSchemaPath,
} from '@nestjs/swagger';

/**
 * Standard API responses for successful operations
 */
export function ApiSuccessResponse<TModel extends Type<any>>(
  model?: TModel,
  description?: string,
) {
  const decorators = [
    ApiOkResponse({
      description: description || 'Successful operation',
      ...(model && {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: getSchemaPath(model) },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      }),
    }),
  ];

  return applyDecorators(...decorators);
}

/**
 * Standard API responses for creation operations
 */
export function ApiCreatedSuccessResponse<TModel extends Type<any>>(
  model?: TModel,
  description?: string,
) {
  const decorators = [
    ApiCreatedResponse({
      description: description || 'Resource created successfully',
      ...(model && {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: getSchemaPath(model) },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      }),
    }),
  ];

  return applyDecorators(...decorators);
}

/**
 * Standard error responses
 */
export function ApiStandardErrorResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request - Invalid input',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Validation failed' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Authentication required',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: 'Authentication required' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - Insufficient permissions',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'FORBIDDEN' },
              message: { type: 'string', example: 'Access denied' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'INTERNAL_ERROR' },
              message: { type: 'string', example: 'Internal server error' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  );
}

/**
 * Standard API responses for resource not found
 */
export function ApiNotFoundResourceResponse(resourceName: string) {
  return ApiNotFoundResponse({
    description: `${resourceName} not found`,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'NOT_FOUND' },
            message: {
              type: 'string',
              example: `${resourceName} not found`,
            },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  });
}

/**
 * Standard API responses for resource conflicts
 */
export function ApiConflictResourceResponse(resourceName: string) {
  return ApiConflictResponse({
    description: `${resourceName} already exists`,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'CONFLICT' },
            message: {
              type: 'string',
              example: `${resourceName} already exists`,
            },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  });
}

/**
 * Combines all standard CRUD operation responses
 */
export function ApiStandardCrudResponses<TModel extends Type<any>>(
  model: TModel,
  resourceName: string,
) {
  return applyDecorators(
    ApiSuccessResponse(model),
    ApiNotFoundResourceResponse(resourceName),
    ApiStandardErrorResponses(),
  );
}
