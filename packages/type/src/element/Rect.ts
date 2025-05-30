interface IRectProps {
  /**
   * 矩形左下角的圆角半径。
   * @type {number}
   * @memberof rectangleState
   */
  rectangleBottomLeftCornerRadius?: number
  /**
   * 矩形右下角的圆角半径。
   * @type {number}
   * @memberof rectangleState
   */
  rectangleBottomRightCornerRadius?: number
  /**
   * 矩形圆角是否独立。
   * @type {boolean}
   * @memberof rectangleState
   */
  rectangleCornerRadiiIndependent?: boolean
  /**
   * 矩形左上角的圆角半径。
   * @type {number}
   * @memberof rectangleState
   */
  rectangleTopLeftCornerRadius?: number
  /**
   * 矩形右上角的圆角半径。
   * @type {number}
   * @memberof rectangleState
   */
  rectangleTopRightCornerRadius?: number

  strokeTopWeight?: number

  strokeBottomWeight?: number

  strokeLeftWeight?: number

  strokeRightWeight?: number

  /**
   * 圆角平滑度
   */
  smoothing?: number
}

export {
  IRectProps,
};