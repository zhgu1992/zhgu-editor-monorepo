import { GeometryNode } from './GeometryNode';
import type { StrokePaints, FillPaints, IStrokeProps, IStrokeBaseProps, INodeElement } from '@zhgu/type';
import { EStrokeCap } from '@zhgu/type';
import type { INodeModel } from '../interface';
import type { ElementData } from '../dataUtil';

class NodeModel extends GeometryNode implements INodeModel {
  constructor(_elementData: ElementData) {
    super(_elementData);
  }

  get name(): string {
    return this.props.name;
  }

  get isVisible(): boolean {
    return this.props.isVisible ?? true;
  }

  get fillPaints(): FillPaints {
    return this.props.fillPaints ?? [];
  }

  get strokePaints(): StrokePaints {
    return this.props.strokePaints ?? [];
  }

  get strokeWeight(): number | undefined {
    return this.props.strokeWeight;
  }

  get strokeProps(): IStrokeProps {
    return {
      strokeWeight: this.props.strokeWeight!,
      strokeAlign: this.props.strokeAlign!,
      strokeJoin: this.props.strokeJoin!,
      strokeCap: this.props.strokeCap ?? EStrokeCap.None,
      dashPattern: this.props.dashPattern ?? [],
      strokePaints: this.strokePaints ?? [],
    };
  }

  get opacity(): number {
    return this.props.opacity ?? 1;
  }

  get isLocked(): boolean {
    return this.props.isLocked ?? false;
  }
}

export { NodeModel };
