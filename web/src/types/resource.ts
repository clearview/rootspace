export interface LinkResource {
  id?: number;
  spaceId: number;
  sectionId: number | null;
  title: string;
  type: string;
  value: string;
  config?: {
    alwaysOpen: boolean;
  };
}
