export interface FocusAABBOptions {
  noAnimation?: boolean;
  edgeDistance?: number;
  removeRuler?: boolean;
  maxZoom?: number;
}

export interface ZoomAtOptions {
  state: -1 | 0 | 1;
  zoom?: number;
}
