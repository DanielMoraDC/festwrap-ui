import { beforeEach, describe, it, expect, vi } from 'vitest';
import { CreateNewPlaylistDTO, Playlist } from '@/entities/playlists';
import { PlaylistsHTTPClient } from './playlists';
import { FakeHttpClient, HttpResponse, Method } from './http';
import { AuthHeaderBuilderStub, AuthHeaderBuilder } from './auth';

describe('PlaylistsHTTPClient', () => {
  describe('searchPlaylists', () => {
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
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

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
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(client.searchPlaylists(token, name, limit)).rejects.toThrow(
        errorMessage
      );
    });

    it('should throw an error if the header builder fails', async () => {
      vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
        throw new Error('test Error');
      });
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(
        client.searchPlaylists(token, name, limit)
      ).rejects.toThrow();
    });
  });

  describe('createPlaylist', () => {
    let url: string;
    let token: string;
    let playlistData: CreateNewPlaylistDTO;
    let httpClient: FakeHttpClient;
    let response: HttpResponse;
    let authHeaderBuilder: AuthHeaderBuilder;

    beforeEach(() => {
      url = 'http://some_url';
      token = 'my-token';
      playlistData = {
        playlist: {
          name: 'Festival Hits',
          description: 'All the best songs',
          isPrivate: false,
        },
        artists: [{ name: 'Artist 1' }, { name: 'Artist 2' }],
      };
      authHeaderBuilder = new AuthHeaderBuilderStub();
    });

    const mockHttpClientResponse = (status: number = 201) => {
      response = {
        data: {
          playlist: {
            id: '123',
          },
        },
        status,
      };
      httpClient = new FakeHttpClient(response);
    };

    it('should call the client with the correct parameters', async () => {
      mockHttpClientResponse();
      const headers = { authorization: 'Bearer token' };
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        new AuthHeaderBuilderStub(headers)
      );
      vi.spyOn(httpClient, 'send');

      await client.createPlaylist(token, playlistData);

      expect(httpClient.send).toHaveBeenCalledWith({
        url: `${url}/playlists`,
        method: Method.Post,
        data: playlistData,
        headers: headers,
      });
    });

    it('should return the response data from the HTTP client without issues when the status is 201', async () => {
      mockHttpClientResponse();
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      const result = await client.createPlaylist(token, playlistData);

      const expectedResponse = {
        id: response.data.playlist.id,
        status: 'CREATED_WITHOUT_ISSUES',
      };
      expect(result).toEqual(expectedResponse);
    });

    it('should return the response data from the HTTP client with missing artists when the status is 207', async () => {
      mockHttpClientResponse(207);
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      const result = await client.createPlaylist(token, playlistData);

      const expectedResponse = {
        id: response.data.playlist.id,
        status: 'CREATED_MISSING_ARTISTS',
      };
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if the HTTP client fails', async () => {
      mockHttpClientResponse();
      const errorMessage = 'Failed to create playlist';
      httpClient.setSendErrorMessage(errorMessage);
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(client.createPlaylist(token, playlistData)).rejects.toThrow(
        errorMessage
      );
    });

    it('should throw an error if the header builder fails', async () => {
      mockHttpClientResponse();
      vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
        throw new Error('Authentication failed');
      });
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(
        client.createPlaylist(token, playlistData)
      ).rejects.toThrow();
    });
  });
});
