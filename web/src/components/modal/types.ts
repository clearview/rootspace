import { Component } from 'vue'

export interface ComponentAttrs {
  [key: string]: any;
}

export interface OpenModalOptions {
  component: Component;
  attrs?: ComponentAttrs;
  to?: string;
}

export interface OpenModal {
  (opts: OpenModalOptions): void;
}

export interface CloseModal {
  (): void;
}

export interface ModalInjectedContext {
  open: OpenModal;
  close: CloseModal;
}
