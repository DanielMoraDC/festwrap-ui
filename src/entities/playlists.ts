export type CreateNewPlaylistDTO = {
  playlist: {
    name: string;
    description?: string | undefined;
    isPrivate: boolean;
  };
  artists: Array<{
    name: string;
  }>;
};

export type CreateNewPlaylistStatusType =
  | 'CREATED_WITHOUT_ISSUES'
  | 'CREATED_MISSING_ARTISTS';

export type CreateNewPlaylistResponseDTO = {
  id: string;
  status: CreateNewPlaylistStatusType;
};

export type UpdatePlaylistDTO = {
  playlistId: string;
  artists: string[];
};

export type PlaylistDTO = {
  id: string;
  name: string;
  description?: string | undefined;
  isPublic: boolean;
};

export class Playlist {
  private id: string;
  private name: string;
  private description: string | undefined = undefined;
  private isPublic: boolean;

  constructor(
    id: string,
    name: string,
    isPublic: boolean,
    description?: string
  ) {
    this.id = id;
    this.name = name;
    this.isPublic = isPublic;
    this.description = description;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getIsPublic(): boolean {
    return this.isPublic;
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isPublic: this.isPublic,
    };
  }
}
