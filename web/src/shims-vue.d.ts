import Vue from 'vue'

declare module '*.vue' {
  export default Vue
}

declare module 'liquor-tree' {
  export interface Node<T> {
    text: string;
    data: T;
    children: T;
    isBatch: boolean;
    isEditing: boolean;
    states: States;
  }

  export interface States {
    [key: string]: boolean;
  }

  export default Vue
}
