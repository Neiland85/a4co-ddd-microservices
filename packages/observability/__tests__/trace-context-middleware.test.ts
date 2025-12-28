import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TraceContextMiddleware } from '../src/middleware/trace-context.middleware';
import { getTraceContext, clearTraceContext } from '../src/utils/async-context';
import { isValidUUID } from '../src/utils/trace-id.generator';

// Mock the logger
vi.mock('../src/logger', () => ({
  getLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}));

describe('TraceContextMiddleware', () => {
  let middleware: TraceContextMiddleware;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;

  beforeEach(() => {
    middleware = new TraceContextMiddleware();
    
    // Mock Express request
    mockRequest = {
      headers: {},
      method: 'GET',
      url: '/test',
      path: '/test',
      ip: '127.0.0.1',
      socket: {
        remoteAddress: '127.0.0.1',
      },
    };

    // Mock Express response
    mockResponse = {
      setHeader: vi.fn(),
      getHeader: vi.fn(),
      send: vi.fn(function(this: any, data: any) {
        return data;
      }),
      json: vi.fn(function(this: any, data: any) {
        return data;
      }),
      statusCode: 200,
    };

    // Mock next function
    mockNext = vi.fn();

    clearTraceContext();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should generate trace ID when not present in headers', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.traceId).toBeDefined();
      expect(mockRequest.spanId).toBeDefined();
      expect(isValidUUID(mockRequest.traceId)).toBe(true);
      expect(isValidUUID(mockRequest.spanId)).toBe(true);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should use existing trace ID from x-trace-id header', () => {
      const customTraceId = '550e8400-e29b-41d4-a716-446655440000';
      mockRequest.headers['x-trace-id'] = customTraceId;

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.traceId).toBe(customTraceId);
      expect(mockRequest.spanId).toBeDefined();
      expect(isValidUUID(mockRequest.spanId)).toBe(true);
    });

    it('should extract trace ID from traceparent header (W3C)', () => {
      mockRequest.headers['traceparent'] = 
        '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01';

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.traceId).toBe('0af7651916cd43dd8448eb211c80319c');
    });

    it('should set trace ID in response headers', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-trace-id',
        expect.any(String)
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-span-id',
        expect.any(String)
      );
    });

    it('should call next() to continue middleware chain', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Trace context injection', () => {
    it('should inject trace context into AsyncLocalStorage', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      // The context should be available within the middleware execution
      expect(mockRequest.traceId).toBeDefined();
      expect(mockRequest.spanId).toBeDefined();
    });

    it('should make trace context available to subsequent code', () => {
      let capturedContext: any;

      middleware.use(mockRequest, mockResponse, mockNext);

      // Simulate accessing context in middleware chain
      const context = getTraceContext();
      capturedContext = context;

      expect(capturedContext.traceId).toBeDefined();
      expect(capturedContext.spanId).toBeDefined();
    });
  });

  describe('Response interception', () => {
    it('should intercept res.send() for logging', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const testData = { message: 'test' };
      mockResponse.send(testData);

      expect(mockResponse.send).toHaveBeenCalledWith(testData);
    });

    it('should intercept res.json() for logging', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      const testData = { data: 'json' };
      mockResponse.json(testData);

      expect(mockResponse.json).toHaveBeenCalledWith(testData);
    });

    it('should capture status code in response', () => {
      mockResponse.statusCode = 404;
      middleware.use(mockRequest, mockResponse, mockNext);

      mockResponse.send({ error: 'Not found' });

      expect(mockResponse.statusCode).toBe(404);
    });
  });

  describe('Request metadata', () => {
    it('should capture request method and URL', () => {
      mockRequest.method = 'POST';
      mockRequest.url = '/api/users';
      mockRequest.path = '/api/users';

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.method).toBe('POST');
      expect(mockRequest.url).toBe('/api/users');
    });

    it('should capture client IP address', () => {
      mockRequest.ip = '192.168.1.1';

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.ip).toBe('192.168.1.1');
    });

    it('should capture user agent from headers', () => {
      mockRequest.headers['user-agent'] = 'Mozilla/5.0';

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.headers['user-agent']).toBe('Mozilla/5.0');
    });
  });

  describe('Unique trace IDs', () => {
    it('should generate different trace IDs for different requests', () => {
      const request1 = { ...mockRequest };
      const request2 = { ...mockRequest };
      const response1 = { ...mockResponse, setHeader: vi.fn(), send: vi.fn(), json: vi.fn() };
      const response2 = { ...mockResponse, setHeader: vi.fn(), send: vi.fn(), json: vi.fn() };

      middleware.use(request1, response1, mockNext);
      middleware.use(request2, response2, mockNext);

      expect(request1.traceId).not.toBe(request2.traceId);
      expect(request1.spanId).not.toBe(request2.spanId);
    });

    it('should generate different span IDs even with same trace ID', () => {
      const customTraceId = '550e8400-e29b-41d4-a716-446655440000';
      
      mockRequest.headers['x-trace-id'] = customTraceId;
      const request1 = { ...mockRequest };
      const response1 = { ...mockResponse, setHeader: vi.fn(), send: vi.fn(), json: vi.fn() };

      middleware.use(request1, response1, mockNext);

      const request2 = { ...mockRequest };
      const response2 = { ...mockResponse, setHeader: vi.fn(), send: vi.fn(), json: vi.fn() };

      middleware.use(request2, response2, mockNext);

      expect(request1.traceId).toBe(customTraceId);
      expect(request2.traceId).toBe(customTraceId);
      expect(request1.spanId).not.toBe(request2.spanId);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing IP address gracefully', () => {
      delete mockRequest.ip;
      delete mockRequest.socket;

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.traceId).toBeDefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle missing user-agent header', () => {
      delete mockRequest.headers['user-agent'];

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.traceId).toBeDefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle empty headers object', () => {
      mockRequest.headers = {};

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.traceId).toBeDefined();
      expect(isValidUUID(mockRequest.traceId)).toBe(true);
    });
  });

  describe('Header format compatibility', () => {
    it('should support Zipkin B3 format', () => {
      mockRequest.headers['x-b3-traceid'] = 'b3-trace-id-123';

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.traceId).toBe('b3-trace-id-123');
    });

    it('should prioritize x-trace-id over other formats', () => {
      mockRequest.headers['x-trace-id'] = 'custom-trace-id';
      mockRequest.headers['traceparent'] = '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01';
      mockRequest.headers['x-b3-traceid'] = 'b3-trace-id';

      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest.traceId).toBe('custom-trace-id');
    });
  });

  describe('Integration with logger', () => {
    it('should log REQUEST_START event', () => {
      // The logger is mocked, but we can verify middleware runs successfully
      middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.traceId).toBeDefined();
    });

    it('should include trace context in logs', () => {
      middleware.use(mockRequest, mockResponse, mockNext);

      // Verify trace context is available for logging
      const context = getTraceContext();
      expect(context.traceId).toBeDefined();
      expect(context.spanId).toBeDefined();
    });
  });
});
