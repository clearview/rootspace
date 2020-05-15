import { OutputData } from '@editorjs/editorjs/types/data-formats/output-data'

export interface LinkResource {
  id: number;
  spaceId: number;
  title: string;
  type: string;
  value: string;
  children?: LinkResource[];
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
}

export interface PasswordResource {
  password: string;
  newPassword: string;
  newPassword_confirmation: string; // eslint-disable-line
}

export interface WorkspaceResource {
  title: string;
  invites: string[];
}

export interface UserResource {
  active: boolean;
  authProvider: string;
  email: string;
  emailConfirmed: boolean;
  firstName: string;
  id: number;
  lastName: string;
  token: string;
  created: string;
  updated: string;
}

export interface Editor {
  documentChanged: boolean;
  editor: any; // eslint-disable-line
}

export interface RootEditor {
  savedData: OutputData;
  onChange: Function;
}

export interface DocumentResource {
  spaceId: number;
  title: string;
  content: object;
  access: number;
}

// export interface DocumentData {
//   time?: number;
//   blocks?: Array<OutputData>;
//   version: string;
// }
