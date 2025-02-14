import { Artist } from '../artists';
import { HTTPAuthHeaderBuilder, BaseHTTPAuthHeaderBuilder } from './auth';
import { HttpClient, Method } from './http';

export interface ArtistsClient {
  searchArtists(
    _token: string,
    _name: string,
    _limit: number
  ): Promise<Artist[]>;
}

export class ArtistsHTTPClient implements ArtistsClient {
  private url: string;
  private httpClient: HttpClient;
  private httpAuthHeaderBuilder: HTTPAuthHeaderBuilder;

  constructor(
    url: string,
    httpClient: HttpClient,
    httpAuthHeaderBuilder: BaseHTTPAuthHeaderBuilder
  ) {
    this.url = url;
    this.httpClient = httpClient;
    this.httpAuthHeaderBuilder = httpAuthHeaderBuilder;
  }

  async searchArtists(
    token: string,
    name: string,
    limit: number
  ): Promise<Artist[]> {
    const authHeader = await this.httpAuthHeaderBuilder.buildHeader(token);
    return this.httpClient
      .send({
        url: `${this.url}/artists/search`,
        method: Method.Get,
        params: { name, limit },
        headers: authHeader,
      })
      .then((response) =>
        response.data.map(
          (artist: any) => new Artist(artist.name, artist.imageUri)
        )
      );
  }
}

export class FakeArtistsHTTPClient implements ArtistsClient {
  private searchArtistError: Error | undefined = undefined;
  private searchArtistResult: Artist[];

  constructor(result: Artist[] = []) {
    this.searchArtistResult = result;
  }

  setResult(result: Artist[]) {
    this.searchArtistResult = result;
  }

  setSearchArtistError(error: Error) {
    this.searchArtistError = error;
  }

  async searchArtists(..._: any[]): Promise<Artist[]> {
    if (this.searchArtistError !== undefined) {
      throw this.searchArtistError;
    }
    return this.searchArtistResult;
  }
}
