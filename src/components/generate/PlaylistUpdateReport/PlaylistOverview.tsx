import { FC } from 'react';

interface PlaylistOverviewProps {
  playlistId: string;
  height?: number;
}

export const PlaylistOverview: FC<PlaylistOverviewProps> = ({
  playlistId,
  height = 500,
}) => {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;

  return (
    <iframe
      src={embedUrl}
      className="rounded"
      width="100%"
      height={height}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify embedded playlist"
    />
  );
};
