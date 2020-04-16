export interface LinkResource {
  spaceId: number | null;
  sectionId: number | null;
  title: string;
  type: string;
  value: string;
  config?: {
    alwaysOpen: boolean;
  };
}
