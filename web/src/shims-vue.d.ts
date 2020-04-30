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
    isBatch: boolean;
    isEditing: boolean;
    states: States;
    children: Node<T>[];
    parent: Node<T>;
    startEditing: () => void;
    remove: () => void;
  }

  export interface NodeContent<T=NodeData> {
    id: string | number;
    text: string;
    data?: T;
    states?: States;
    children?: NodeContent<T>[];
  }

  export interface States {
    [key: string]: boolean;
  }

  export default Vue
}

declare module 'vue-multipane'
