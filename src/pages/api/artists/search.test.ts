import { describe, it, vi, expect } from 'vitest';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSearchArtistHandler, SearchArtistHandlerParams } from './search';
import { FakeBackendClient } from '@/lib/clients/backend';
import { Artist } from '@/lib/artists';

describe('searchArtistHandler', () => {
  function createMockRequest(
    query: any = { name: 'Brutus', token: 'some token' }
  ): NextApiRequest {
    return { query } as unknown as NextApiRequest;
  }

  function createMockResponse(): NextApiResponse {
    const response = {} as NextApiResponse;
    response.status = vi.fn().mockReturnValue(response);
    response.json = vi.fn().mockReturnValue(response);
    return response;
  }

  function createHandler(
    { client, defaultLimit, maxLimit }: SearchArtistHandlerParams = {
      client: new FakeBackendClient(),
      defaultLimit: 5,
      maxLimit: 10,
    }
  ): (_request: NextApiRequest, _response: NextApiResponse) => Promise<void> {
    return createSearchArtistHandler({ client, defaultLimit, maxLimit });
  }

  it.each([
    { _title: 'not a number', limit: 'invalid' },
    { _title: 'bigger than maximum', limit: '20' },
  ])('should return 400 if limit is $_title', async ({ limit }) => {
    const request = createMockRequest({ name: 'test', token: 'test', limit });
    const response = createMockResponse();

    createHandler()(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: `"limit" should be a number in interval [1, 10]`,
    });
  });

  it.each([
    {
      _title: 'name is missing',
      variable: 'name',
      name: null,
      token: 'some token',
    },
    {
      _title: 'name is not a string',
      variable: 'name',
      name: 42,
      token: 'some token',
    },
    {
      _title: 'token is missing',
      variable: 'token',
      name: 'some name',
      token: null,
    },
    {
      _title: 'token is not a string',
      variable: 'token',
      name: 'some name',
      token: 10,
    },
  ])('should return 400 if $_title', async ({ variable, name, token }) => {
    const request = createMockRequest({ name: name, token: token });
    const response = createMockResponse();

    createHandler()(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: `"${variable}" should be provided as a string`,
    });
  });

  it.each([{ limit: undefined }, { limit: '4' }])(
    'should search with the provided arguments (limit: $limit)',
    async ({ limit }) => {
      const args: { name: string; token: string } = {
        name: 'name',
        token: 'token',
      };
      const request = createMockRequest({ ...args, limit: limit });
      const client = new FakeBackendClient();
      vi.spyOn(client, 'searchArtists');

      const defaultLimit = 5;
      createHandler({
        client: client,
        defaultLimit: defaultLimit,
        maxLimit: 10,
      })(request, createMockResponse());

      expect(client.searchArtists).toBeCalledWith(
        args.token,
        args.name,
        limit ? parseInt(limit, 10) : defaultLimit
      );
    }
  );

  it('should return backend client results', async () => {
    const retrievedArtist = [
      new Artist('Brutus'),
      new Artist('Brutus Daughters', 'http://some_url'),
    ];
    const client = new FakeBackendClient(retrievedArtist);
    const response = createMockResponse();

    const handler = createHandler({
      client: client,
      defaultLimit: 5,
      maxLimit: 10,
    });
    await handler(createMockRequest(), response);

    const expected = {
      artists: [
        { name: 'Brutus' },
        { name: 'Brutus Daughters', imageUri: 'http://some_url' },
      ],
      message: 'Artists successfully retrieved',
    };

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith(expected);
  });

  it('should return an error if search fails', async () => {
    const client = new FakeBackendClient();
    client.setSearchArtistError(new Error('test error'));
    const response = createMockResponse();

    const handler = createHandler({
      client: client,
      defaultLimit: 5,
      maxLimit: 10,
    });
    await handler(createMockRequest(), response);

    expect(response.status).toBeCalledWith(500);
    expect(response.json).toBeCalledWith({
      message: 'Unexpected error, cannot retrieve artists',
    });
  });
});
