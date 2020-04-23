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

export interface SignupResource {
  name: string;
  email: string;
  password: string;
  password_confirmation: string; // eslint-disable-line
}

export interface SigninResource {
  email: string;
  password: string;
}
