import { StaticImageData } from 'next/image';

export type SearchedBand = {
  id: string;
  title: string;
  icon?: StaticImageData;
};

export type ImageConfig = {
  width: number;
  height: number;
};

export interface BandSearcher {
  searchArtists(_name: string): Promise<SearchedBand[]>;
}

export class NonPaginatedBandSearcher implements BandSearcher {
  private host: string;
  private accessToken: string;
  private limit: number;
  private imageConfig: ImageConfig;

  constructor(
    host: string,
    accessToken: string,
    limit: number = 5,
    imageConfig: ImageConfig = { height: 32, width: 32 }
  ) {
    this.host = host;
    this.accessToken = accessToken;
    this.limit = limit;
    this.imageConfig = imageConfig;
  }

  async searchArtists(name: string): Promise<SearchedBand[]> {
    const url = `${this.host}/api/artists/search`;
    const response = await fetch(
      `${url}?name=${name}&token=${this.accessToken}&limit=${this.limit}`
    );
    if (!response.ok) {
      throw new Error('Could not obtain response from server');
    }
    const data = await response.json();
    if (!data.artists) {
      throw new Error('No artists found in the response');
    }
    return data.artists.map((artist: any) =>
      !artist.imageUri
        ? { id: artist.name, title: artist.name }
        : {
            id: artist.name + '_' + artist.imageUri,
            title: artist.name,
            icon: {
              src: artist.imageUri,
              height: this.imageConfig.height,
              width: this.imageConfig.width,
            },
          }
    );
  }
}

export class BandSearcherStub implements BandSearcher {
  private results: SearchedBand[];

  constructor(results: SearchedBand[]) {
    this.results = results;
  }

  async searchArtists(_: string): Promise<SearchedBand[]> {
    return this.results;
  }
}
