/* eslint-disable import/no-duplicates */

declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}

declare module 'liquor-tree' {
  import Vue from 'vue'

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
