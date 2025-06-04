import { NodeFactory } from './nodeFactory';
import { ERootElementType } from '@zhgu/type';
import { NodeModel } from '@zhgu/data';

export class Document extends NodeModel {}

NodeFactory.register(ERootElementType.Document, Document);
