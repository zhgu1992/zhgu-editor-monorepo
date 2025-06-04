import type { IDocumentOrElement } from '../element';

interface Blob {
  byte: number[];
}

type Blobs = Blob[];

type DocumentData = {
  version: number;
  elements: IDocumentOrElement[];
  blobs: Blobs;
};

type ChangeRecipe<T> = (draft: T) => T | void;

export type IRect = [left: number, top: number, right: number, bottom: number];

export { DocumentData, ChangeRecipe };
