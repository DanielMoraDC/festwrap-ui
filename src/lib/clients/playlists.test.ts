import { beforeEach, describe, it, expect, vi } from 'vitest';
import { Playlist } from '@/lib/playlists';
import { PlaylistsHTTPClient } from './playlists';
import { FakeHttpClient, HttpResponse, Method } from './http';
import { AuthHeaderBuilderStub, AuthHeaderBuilder } from './auth';

describe('PlaylistsHTTPClient', () => {
  let url: string;
  let token: string;
  let name: string;
  let limit: number;
  let httpClient: FakeHttpClient;
  let response: HttpResponse;
  let authHeaderBuilder: AuthHeaderBuilder;

  beforeEach(() => {
    url = 'http://some_url';
    token = 'my-token';
    name = 'Chill';
    limit = 5;
    response = {
      data: [
        {
          id: '1',
          name: 'Chill Vibes',
          description: 'Some description',
          isPublic: true,
        },
        {
          id: '2',
          name: 'Chill Hits',
          description: 'Some description',
          isPublic: true,
        },
      ],
      status: 200,
    };
    httpClient = new FakeHttpClient(response);
    authHeaderBuilder = new AuthHeaderBuilderStub();
  });

  it('should call the client with the correct parameters', async () => {
    const headers = { something: 'value' };
    const client = new PlaylistsHTTPClient(
      url,
      httpClient,
      new AuthHeaderBuilderStub(headers)
    );
    vi.spyOn(httpClient, 'send');

    await client.searchPlaylists(token, name, limit);

    expect(httpClient.send).toHaveBeenCalledWith({
      url: `${url}/playlists/search`,
      method: Method.Get,
      params: { name: name, limit: limit },
      headers: headers,
    });
  });

  it('should return the list of playlists returned by the HTTP client', async () => {
    const client = new PlaylistsHTTPClient(url, httpClient, authHeaderBuilder);

    const actual = await client.searchPlaylists(token, name, limit);

    const expected = [
      new Playlist('1', 'Chill Vibes', true, 'Some description'),
      new Playlist('2', 'Chill Hits', true, 'Some description'),
    ];
    expect(actual).toEqual(expected);
  });

  it('should throw an error if the HTTP client fails', async () => {
    const errorMessage = 'Request failed';
    httpClient.setSendErrorMessage(errorMessage);
    const client = new PlaylistsHTTPClient(url, httpClient, authHeaderBuilder);

    await expect(client.searchPlaylists(token, name, limit)).rejects.toThrow(
      errorMessage
    );
  });

  it('should throw an error if the header builder fails', async () => {
    vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
      throw new Error('test Error');
    });
    const client = new PlaylistsHTTPClient(url, httpClient, authHeaderBuilder);

    await expect(client.searchPlaylists(token, name, limit)).rejects.toThrow();
  });
});
