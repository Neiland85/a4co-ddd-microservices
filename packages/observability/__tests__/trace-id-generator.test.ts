import { describe, it, expect } from 'vitest';
import {
  generateTraceId,
  generateSpanId,
  isValidUUID,
  extractTraceIdFromHeaders,
} from '../src/utils/trace-id.generator';

describe('Trace ID Generator', () => {
  describe('generateTraceId', () => {
    it('should generate a valid UUID v4', () => {
      const traceId = generateTraceId();
      expect(traceId).toBeDefined();
      expect(typeof traceId).toBe('string');
      expect(isValidUUID(traceId)).toBe(true);
    });

    it('should generate unique trace IDs', () => {
      const traceId1 = generateTraceId();
      const traceId2 = generateTraceId();
      expect(traceId1).not.toBe(traceId2);
    });

    it('should match UUID v4 format', () => {
      const traceId = generateTraceId();
      const uuidV4Pattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(traceId).toMatch(uuidV4Pattern);
    });
  });

  describe('generateSpanId', () => {
    it('should generate a valid UUID v4', () => {
      const spanId = generateSpanId();
      expect(spanId).toBeDefined();
      expect(typeof spanId).toBe('string');
      expect(isValidUUID(spanId)).toBe(true);
    });

    it('should generate unique span IDs', () => {
      const spanId1 = generateSpanId();
      const spanId2 = generateSpanId();
      expect(spanId1).not.toBe(spanId2);
    });
  });

  describe('isValidUUID', () => {
    it('should validate correct UUID v4', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidUUID(validUUID)).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('12345')).toBe(false);
      expect(isValidUUID('')).toBe(false);
    });

    it('should reject UUID with wrong version', () => {
      const uuidV1 = '550e8400-e29b-11d4-a716-446655440000'; // v1
      expect(isValidUUID(uuidV1)).toBe(false);
    });

    it('should handle uppercase UUIDs', () => {
      const uppercaseUUID = '550E8400-E29B-41D4-A716-446655440000';
      expect(isValidUUID(uppercaseUUID)).toBe(true);
    });
  });

  describe('extractTraceIdFromHeaders', () => {
    it('should extract trace ID from x-trace-id header', () => {
      const headers = {
        'x-trace-id': 'custom-trace-123',
      };
      const traceId = extractTraceIdFromHeaders(headers);
      expect(traceId).toBe('custom-trace-123');
    });

    it('should extract trace ID from traceparent header (W3C format)', () => {
      const headers = {
        traceparent: '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01',
      };
      const traceId = extractTraceIdFromHeaders(headers);
      expect(traceId).toBe('0af7651916cd43dd8448eb211c80319c');
    });

    it('should extract trace ID from x-b3-traceid header (Zipkin B3)', () => {
      const headers = {
        'x-b3-traceid': 'zipkin-trace-id',
      };
      const traceId = extractTraceIdFromHeaders(headers);
      expect(traceId).toBe('zipkin-trace-id');
    });

    it('should prioritize x-trace-id over other headers', () => {
      const headers = {
        'x-trace-id': 'priority-trace',
        traceparent: '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01',
        'x-b3-traceid': 'b3-trace',
      };
      const traceId = extractTraceIdFromHeaders(headers);
      expect(traceId).toBe('priority-trace');
    });

    it('should return undefined when no trace headers present', () => {
      const headers = {
        'user-agent': 'test-agent',
        'content-type': 'application/json',
      };
      const traceId = extractTraceIdFromHeaders(headers);
      expect(traceId).toBeUndefined();
    });

    it('should handle empty headers object', () => {
      const traceId = extractTraceIdFromHeaders({});
      expect(traceId).toBeUndefined();
    });

    it('should handle malformed traceparent header', () => {
      const headers = {
        traceparent: 'invalid-format',
      };
      const traceId = extractTraceIdFromHeaders(headers);
      expect(traceId).toBeUndefined();
    });

    it('should handle array values in headers', () => {
      const headers = {
        'x-trace-id': ['trace-1', 'trace-2'],
      };
      const traceId = extractTraceIdFromHeaders(headers);
      // Should be undefined because we expect string, not array
      expect(traceId).toBeUndefined();
    });
  });

  describe('Integration scenarios', () => {
    it('should support full trace generation workflow', () => {
      const traceId = generateTraceId();
      const spanId = generateSpanId();

      expect(isValidUUID(traceId)).toBe(true);
      expect(isValidUUID(spanId)).toBe(true);
      expect(traceId).not.toBe(spanId);
    });

    it('should handle realistic header extraction scenarios', () => {
      // Scenario 1: New request without trace ID
      const headers1 = { 'user-agent': 'Mozilla/5.0' };
      const extracted1 = extractTraceIdFromHeaders(headers1);
      expect(extracted1).toBeUndefined();

      // Scenario 2: Request with custom trace ID
      const headers2 = { 'x-trace-id': generateTraceId() };
      const extracted2 = extractTraceIdFromHeaders(headers2);
      expect(extracted2).toBeDefined();
      expect(isValidUUID(extracted2!)).toBe(true);

      // Scenario 3: Request from W3C-compliant system
      const headers3 = {
        traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
      };
      const extracted3 = extractTraceIdFromHeaders(headers3);
      expect(extracted3).toBe('4bf92f3577b34da6a3ce929d0e0e4736');
    });
  });
});
