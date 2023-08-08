export interface svgIconStyleProps {
  width: string
  height: string
}

export interface ICON_STYLES_PROPS {
  ICON_STYLES: svgIconStyleProps
  COLOR?: string
  DEFAULT_COLOR?: string
}

export interface RatingProps {
  precision?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
  count?: number
  shape?: 'star' | 'heart'
  activeColor?: string
  defaultColor?: string
  defaultValue: number
  readOnly?: boolean
  classNames?: string
  size?: string
  spacing?: string
  titleArray?: string[]
  showTitle?: boolean
  onChange?: (newRating: number) => void
  onHover?: (hoveredRating: number) => void
}
