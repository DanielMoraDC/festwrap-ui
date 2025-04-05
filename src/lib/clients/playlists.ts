import {
  CreateNewPlaylistDTO,
  CreateNewPlaylistResponseDTO,
  Playlist,
} from '@/entities/playlists';
import { AuthHeaderBuilder, BaseAuthHeaderBuilder } from './auth';
import { HttpClient, Method } from './http';

export interface PlaylistsClient {
  searchPlaylists(
    _token: string,
    _name: string,
    _limit: number
  ): Promise<Playlist[]>;
  createPlaylist(
    _token: string,
    _playlist: CreateNewPlaylistDTO
  ): Promise<CreateNewPlaylistResponseDTO>;
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

  async createPlaylist(
    token: string,
    playlist: CreateNewPlaylistDTO
  ): Promise<CreateNewPlaylistResponseDTO> {
    const authHeader = await this.httpAuthHeaderBuilder.buildHeader(token);
    return this.httpClient
      .send({
        url: `${this.url}/playlists`,
        method: Method.Post,
        data: playlist,
        headers: authHeader,
      })
      .then((response: any) => {
        if (response.status === 201) {
          return {
            id: response.data.playlist.id,
            status: 'CREATED_WITHOUT_ISSUES',
          };
        }
        return {
          id: response.data.playlist.id,
          status: 'CREATED_MISSING_ARTISTS',
        };
      });
  }
}

export class PlaylistsClientStub implements PlaylistsClient {
  private searchPlaylistResult: Playlist[];
  private createPlaylistResult: CreateNewPlaylistResponseDTO;

  constructor(
    searchPlaylistResult: Playlist[] = [],
    createPlaylistResult: CreateNewPlaylistResponseDTO = {
      id: '1',
      status: 'CREATED_WITHOUT_ISSUES',
    }
  ) {
    this.searchPlaylistResult = searchPlaylistResult;
    this.createPlaylistResult = createPlaylistResult;
  }

  async searchPlaylists(..._: any[]): Promise<Playlist[]> {
    return this.searchPlaylistResult;
  }

  async createPlaylist(..._: any[]): Promise<any> {
    return this.createPlaylistResult;
  }
}
