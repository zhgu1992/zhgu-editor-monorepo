interface ICornerRadiusProps {
  cornerRadius: number;
}

interface IRectangleCornerRadiusProps {
  rectangleBottomLeftCornerRadius?: number;
  rectangleBottomRightCornerRadius?: number;
  rectangleTopLeftCornerRadius?: number;
  rectangleTopRightCornerRadius?: number;
  rectangleCornerRadiiIndependent?: boolean;
}

export { ICornerRadiusProps, IRectangleCornerRadiusProps };
