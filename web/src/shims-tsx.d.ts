import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }

  namespace Resource {
    interface Link {
      spaceId: number | null;
      sectionId: number | null;
      title: string;
      type: string;
      value: string;
      config?: {
        alwaysOpen: boolean;
      };
    }
  }
}
