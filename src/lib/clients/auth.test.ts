import { beforeEach, describe, it, expect, vi } from 'vitest';
import {
  FakeAuthClient,
  HTTPAuthClient,
  BaseHTTPAuthHeaderBuilder,
} from './auth';
import { FakeHttpClient, HttpResponse, Method } from './http';

describe('AuthClient', () => {
  describe('HTTPAuthClient', () => {
    const audience = 'test-audience';
    let httpClient: FakeHttpClient;
    let response: HttpResponse;

    beforeEach(() => {
      response = { data: 'test-token', status: 200 };
      httpClient = new FakeHttpClient(response);
    });

    it('should call the client with the correct parameters', async () => {
      const authClient = new HTTPAuthClient(httpClient, audience);
      const baseUrl = 'http://some_url/auth';
      authClient.setBaseUrl(baseUrl);
      vi.spyOn(httpClient, 'send');

      await authClient.getToken();

      expect(httpClient.send).toHaveBeenCalledWith({
        url: baseUrl,
        method: Method.Get,
        params: { audience: audience },
        headers: { 'Metadata-Flavor': 'Google' },
      });
    });

    it('should return token from the client', async () => {
      const expected = 'some-token';
      httpClient.setResult({ data: expected, status: 200 });
      const authClient = new HTTPAuthClient(httpClient, audience);

      const actual = await authClient.getToken();

      expect(actual).toBe(expected);
    });

    it('should throw an error if the client fails', async () => {
      const errorMessage = 'Test error';
      httpClient.setSendErrorMessage('Test error');
      const authClient = new HTTPAuthClient(httpClient, audience);

      await expect(authClient.getToken()).rejects.toThrow(errorMessage);
    });
  });

  describe('BaseHTTPAuthHeaderBuilder', () => {
    function createAuthClient() {
      const authHeader = 'X-Serverless-Authorization';
      const authToken = 'test-token';
      return new FakeAuthClient(authToken, authHeader);
    }

    it('should call getToken and getHeaderName on authClient', async () => {
      const authClient = createAuthClient();
      vi.spyOn(authClient, 'getToken');
      vi.spyOn(authClient, 'getHeaderName');
      const client = new BaseHTTPAuthHeaderBuilder(authClient);

      const token = 'app-token';
      await client.buildHeader(token);

      expect(authClient.getToken).toHaveBeenCalled();
      expect(authClient.getHeaderName).toHaveBeenCalled();
    });

    it('should return the correct auth header if token is provided', async () => {
      const client = new BaseHTTPAuthHeaderBuilder();

      const token = 'app-token';
      const headers = await client.buildHeader(token);

      expect(headers).toEqual({ Authorization: 'Bearer app-token' });
    });

    it('should return the correct auth header if authClient and token are provided', async () => {
      const authClient = createAuthClient();
      const client = new BaseHTTPAuthHeaderBuilder(authClient);

      const token = 'app-token';
      const headers = await client.buildHeader(token);

      expect(headers).toEqual({
        Authorization: 'Bearer app-token',
        'X-Serverless-Authorization': 'Bearer test-token',
      });
    });

    it('should throw an error if the auth client fails', async () => {
      const errorMessage = 'Auth request failed';
      const authClient = createAuthClient();
      authClient.setGetTokenErrorMessage(errorMessage);
      const client = new BaseHTTPAuthHeaderBuilder(authClient);

      const token = 'app-token';
      await expect(client.buildHeader(token)).rejects.toThrow(errorMessage);
    });
  });
});
