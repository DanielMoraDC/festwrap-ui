import { Playlist } from '../playlists';
import { AuthHeaderBuilder, BaseAuthHeaderBuilder } from './auth';
import { HttpClient, Method } from './http';

export interface PlaylistsClient {
  searchPlaylists(
    _token: string,
    _name: string,
    _limit: number
  ): Promise<Playlist[]>;
}

export class PlaylistsHTTPClient implements PlaylistsClient {
  private url: string;
  private httpClient: HttpClient;
  private httpAuthHeaderBuilder: AuthHeaderBuilder;

  constructor(
    url: string,
    httpClient: HttpClient,
    httpAuthHeaderBuilder: BaseAuthHeaderBuilder
  ) {
    this.url = url;
    this.httpClient = httpClient;
    this.httpAuthHeaderBuilder = httpAuthHeaderBuilder;
  }

  async searchPlaylists(
    token: string,
    name: string,
    limit: number
  ): Promise<Playlist[]> {
    const authHeader = await this.httpAuthHeaderBuilder.buildHeader(token);
    return this.httpClient
      .send({
        url: `${this.url}/playlists/search`,
        method: Method.Get,
        params: { name, limit },
        headers: authHeader,
      })
      .then((response) =>
        response.data.map(
          (playlist: any) =>
            new Playlist(
              playlist.id,
              playlist.name,
              playlist.isPublic,
              playlist.description
            )
        )
      );
  }
}

export class PlaylistsClientStub implements PlaylistsClient {
  private searchPlaylistResult: Playlist[];

  constructor(result: Playlist[] = []) {
    this.searchPlaylistResult = result;
  }

  async searchPlaylists(..._: any[]): Promise<Playlist[]> {
    return this.searchPlaylistResult;
  }
}
