import { describe, it, vi, expect, beforeEach } from 'vitest';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  createSearchPlaylistHandler,
  SearchPlaylistHandlerParams,
} from './search';
import { PlaylistsClientStub } from '@/lib/clients/playlists';
import { Playlist } from '@/lib/playlists';
import { getToken } from 'next-auth/jwt';

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

describe('createSearchPlaylistHandler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getToken).mockResolvedValue({ accessToken: 'mocked-token' });
  });

  function createMockRequest(
    query: any = { name: 'Chill Vibes' }
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
    { client, defaultLimit, maxLimit }: SearchPlaylistHandlerParams = {
      client: new PlaylistsClientStub(),
      defaultLimit: 5,
      maxLimit: 10,
    }
  ): (_request: NextApiRequest, _response: NextApiResponse) => Promise<void> {
    return createSearchPlaylistHandler({ client, defaultLimit, maxLimit });
  }

  it.each([
    { _title: 'not a number', limit: 'invalid' },
    { _title: 'bigger than maximum', limit: '20' },
  ])('should return 400 if limit is $_title', async ({ limit }) => {
    const request = createMockRequest({ name: 'test', limit });
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
    },
    {
      _title: 'name is not a string',
      variable: 'name',
      name: 42,
    },
  ])('should return 400 if $_title', async ({ variable, name }) => {
    const request = createMockRequest({ name: name });
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
      const args: { name: string } = {
        name: 'name',
      };
      const request = createMockRequest({ ...args, limit: limit });
      const client = new PlaylistsClientStub();
      vi.spyOn(client, 'searchPlaylists');

      const defaultLimit = 5;

      await createHandler({
        client: client,
        defaultLimit: defaultLimit,
        maxLimit: 10,
      })(request, createMockResponse());

      expect(client.searchPlaylists).toBeCalledWith(
        'mocked-token',
        args.name,
        limit ? parseInt(limit, 10) : defaultLimit
      );
    }
  );

  it('should return backend client results', async () => {
    const retrievedPlaylists = [
      new Playlist('1', 'Chill Vibes', true, 'Relaxing music'),
      new Playlist('2', 'Workout Hits', false, 'High energy music'),
    ];
    const client = new PlaylistsClientStub(retrievedPlaylists);
    const response = createMockResponse();

    const handler = createHandler({
      client: client,
      defaultLimit: 5,
      maxLimit: 10,
    });
    await handler(createMockRequest(), response);

    const expected = {
      playlists: [
        {
          id: '1',
          name: 'Chill Vibes',
          description: 'Relaxing music',
          isPublic: true,
        },
        {
          id: '2',
          name: 'Workout Hits',
          description: 'High energy music',
          isPublic: false,
        },
      ],
      message: 'Playlists successfully retrieved',
    };

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith(expected);
  });

  it('should return an error if search fails', async () => {
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'searchPlaylists').mockImplementation(() => {
      throw new Error('test error');
    });
    const response = createMockResponse();

    const handler = createHandler({
      client: client,
      defaultLimit: 5,
      maxLimit: 10,
    });
    await handler(createMockRequest(), response);

    expect(response.status).toBeCalledWith(500);
    expect(response.json).toBeCalledWith({
      message: 'Unexpected error, cannot retrieve playlists',
    });
  });

  it('should return 401 if token is not provided', async () => {
    vi.mocked(getToken).mockResolvedValue(null);
    const response = createMockResponse();

    const handler = createHandler();
    await handler(createMockRequest(), response);

    expect(response.status).toBeCalledWith(401);
    expect(response.json).toBeCalledWith({
      message: 'Unauthorized',
    });
  });
});
