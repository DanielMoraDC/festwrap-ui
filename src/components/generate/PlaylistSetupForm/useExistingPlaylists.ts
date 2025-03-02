import { useState, useCallback } from 'react';
import { Playlist, PlaylistsService } from '@/services/playlistsService';
import { FetchService } from '@/services/fetchService';

export function useExistingPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (name: string, limit: number = 5) => {
    try {
      if (name.trim() === '') {
        setPlaylists([]);
        return;
      }

      setLoading(true);
      const fetchService = new FetchService();
      const playlistsService = new PlaylistsService(fetchService);
      const data = await playlistsService.searchPlaylists(name, limit);
      setPlaylists(data.playlists || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { playlists, loading, error, search };
}
