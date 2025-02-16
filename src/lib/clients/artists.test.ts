import { beforeEach, describe, it, expect, vi } from 'vitest';
import { Artist } from '@/lib/artists';
import { ArtistsHTTPClient } from './artists';
import { FakeHttpClient, HttpResponse, Method } from './http';
import { AuthHeaderBuilderStub, AuthHeaderBuilder } from './auth';

describe('ArtistsHTTPClient', () => {
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
    name = 'Iron';
    limit = 5;
    response = {
      data: [
        { name: 'Iron Chic', imageUri: 'https://some_image' },
        { name: 'Iron Maiden' },
      ],
      status: 200,
    };
    httpClient = new FakeHttpClient(response);
    authHeaderBuilder = new AuthHeaderBuilderStub();
  });

  it('should call the client with the correct parameters', async () => {
    const headers = { something: 'value' };
    const client = new ArtistsHTTPClient(
      url,
      httpClient,
      new AuthHeaderBuilderStub(headers)
    );
    vi.spyOn(httpClient, 'send');

    await client.searchArtists(token, name, limit);

    expect(httpClient.send).toHaveBeenCalledWith({
      url: `${url}/artists/search`,
      method: Method.Get,
      params: { name: name, limit: limit },
      headers: headers,
    });
  });

  it('should return the list of artists returned by the HTTP client', async () => {
    const client = new ArtistsHTTPClient(url, httpClient, authHeaderBuilder);

    const actual = await client.searchArtists(token, name, limit);

    const expected = [
      new Artist('Iron Chic', 'https://some_image'),
      new Artist('Iron Maiden'),
    ];
    expect(actual).toEqual(expected);
  });

  it('should throw an error if the HTTP client fails', async () => {
    const errorMessage = 'Request failed';
    httpClient.setSendErrorMessage(errorMessage);
    const client = new ArtistsHTTPClient(url, httpClient, authHeaderBuilder);

    await expect(client.searchArtists(token, name, limit)).rejects.toThrow(
      errorMessage
    );
  });

  it('should throw an error if the header builder fails', async () => {
    vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
      throw new Error('test Error');
    });
    const client = new ArtistsHTTPClient(url, httpClient, authHeaderBuilder);

    await expect(client.searchArtists(token, name, limit)).rejects.toThrow();
  });
});
