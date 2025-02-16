export class Playlist {
  private name: string;
  private description: string | undefined = undefined;
  private isPublic: boolean;

  constructor(name: string, isPublic: boolean, description?: string) {
    this.name = name;
    this.isPublic = isPublic;
    this.description = description;
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
      name: this.name,
      description: this.description,
      isPublic: this.isPublic,
    };
  }
}
