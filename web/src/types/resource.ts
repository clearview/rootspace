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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation: string; // eslint-disable-line
}

export interface SigninResource {
  email: string;
  password: string;
}

export interface SettingsResource {
  firstName: string;
  lastName: string;
  email: string;
  oldPassword: string;
  password: string;
  password_confirmation: string; // eslint-disable-line
}

export interface WorkspaceResource {
  title: string;
  invites: string[];
}
