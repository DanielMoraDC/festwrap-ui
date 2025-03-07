import { ResponseData } from '@/pages/api/playlists/search';
import { IFetchService } from './fetchService';

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
};

export interface IPlaylistsService {
  searchPlaylists(_name: string, _limit: number): Promise<ResponseData>;
}

export class PlaylistsService implements IPlaylistsService {
  private fetchService: IFetchService;

  constructor(fetchService: IFetchService) {
    this.fetchService = fetchService;
  }

  async searchPlaylists(name: string, limit: number): Promise<ResponseData> {
    const url = `/api/playlists/search?name=${name}&limit=${limit}`;
    return this.fetchService.fetchData<ResponseData>(url);
  }
}
