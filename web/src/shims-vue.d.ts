/* eslint-disable import/no-duplicates */

declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}

declare module 'liquor-tree' {
  import Vue from 'vue'

  export interface NodeData {
    text: string;
  }

  export interface Node<T=NodeData> {
    id: string | number;
    text: string;
    data: T;
    children: Node<T>[];
    isBatch: boolean;
    isEditing: boolean;
    parent: Node<T> | null;
    states: States;
  }

  export interface States {
    [key: string]: boolean;
  }

  export default Vue
}

declare module 'vue-multipane'
