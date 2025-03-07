import { useState, useCallback } from 'react';
import { Playlist } from '@/services/playlistsService';
import { useServices } from '@/contexts/ServiceContext';

export function useExistingPlaylists() {
  const { playlistsService } = useServices();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (name: string, limit: number = 5) => {
      try {
        if (name.trim() === '') {
          setPlaylists([]);
          return;
        }

        setLoading(true);
        const data = await playlistsService.searchPlaylists(name, limit);
        setPlaylists(data.playlists || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [playlistsService]
  );

  return { playlists, loading, error, search };
}
