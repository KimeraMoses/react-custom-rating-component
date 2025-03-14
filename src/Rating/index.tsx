import React, { useState, useRef, FC } from 'react'

export interface SvgIconStyleProps {
  width: string
  height: string
}
export interface IconStylesProps {
  iconStyles: SvgIconStyleProps
  activeColor?: string
  defaultColor?: string
}

// prettier-ignore
export type RatingProps = {
  precision?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
  count?: number
  shape?: 'star' | 'heart' | 'custom'
  activeColor?: string
  defaultColor?: string
  defaultValue: number
  readOnly?: boolean
  size?: string
  spacing?: string
  titleArray?: string[]
  showTitle?: boolean
  onChange?: (newRating: number) => void
  onHover?: (hoveredRating: number) => void
} & (
    | {
      shape?: 'star' | 'heart'
      emptyIcon?: (IconStyles: IconStylesProps) => JSX.Element
      fillIcon?: (IconStyles: IconStylesProps) => JSX.Element
    }
    | {
      shape: 'custom'
      emptyIcon: (IconStyles: IconStylesProps) => JSX.Element
      fillIcon: (IconStyles: IconStylesProps) => JSX.Element
    }
  )

const svgIconPath = 'm25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z'
const svgIconViewBox = '0 0 51 48'

const FullStar: FC<IconStylesProps> = ({ iconStyles }) => {
  return (
    <svg viewBox={svgIconViewBox} style={iconStyles}>
      <path d={svgIconPath} fill='currentColor'></path>
    </svg>
  )
}

const EmptyStar: FC<IconStylesProps> = ({ iconStyles, defaultColor = 'rgb(203, 211, 227)' }) => {
  const pathStyle = {
    fill: defaultColor,
    transition: 'fill .2s ease-in-out',
  }

  return (
    <svg viewBox={svgIconViewBox} style={iconStyles}>
      <path style={pathStyle} d={svgIconPath} />
    </svg>
  )
}

const HeartEmptyIcon: FC<IconStylesProps> = ({ iconStyles, defaultColor }) => {
  return (
    <svg viewBox='0 0 24 24' style={iconStyles} fill={defaultColor}>
      <path d='M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z'></path>
    </svg>
  )
}

const HeartFullIcon: FC<IconStylesProps> = ({ iconStyles }) => {
  return (
    <svg viewBox='0 0 24 24' style={iconStyles} fill='currentColor'>
      <path d='m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'></path>
    </svg>
  )
}

const Rating = ({
  precision = 1,
  count = 5,
  shape = 'star',
  defaultValue = 0,
  onChange,
  onHover,
  readOnly = false,
  size = '24px',
  spacing = '5px',
  activeColor = 'orange',
  defaultColor = 'gray',
  titleArray = ['Poor', 'Good', 'Very Good', 'Best', 'Excellent'],
  showTitle = false,
  emptyIcon,
  fillIcon,
}: RatingProps) => {
  if (showTitle && titleArray.length < count) {
    throw new Error('titleArray length must be greater than or equal to count.')
  }
  const [activeIcon, setActiveIcon] = useState<number>(defaultValue)
  const [hoverActiveIcon, setHoverActiveIcon] = useState<number>(-1)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const ratingContainerRef = useRef<HTMLDivElement | null>(null)

  const calculateRating = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): number => {
    const { width, left } = ratingContainerRef.current!.getBoundingClientRect()
    const percent = (e.clientX - left) / width
    const numberInStars = percent * count
    const nearestNumber = Math.round((numberInStars + precision / 2) / precision) * precision

    return Number(nearestNumber.toFixed(precision.toString().split('.')[1]?.length || 0))
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (readOnly) return
    setIsHovered(false)
    setActiveIcon(calculateRating(e))
    onChange && onChange(calculateRating(e))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (readOnly) return
    setIsHovered(true)
    setHoverActiveIcon(calculateRating(e))
    onHover && onHover(calculateRating(e))
  }

  const handleMouseLeave = (): void => {
    if (readOnly) return
    setHoverActiveIcon(-1) // Reset to default state
    setIsHovered(false)
  }

  const iconStyles: SvgIconStyleProps = {
    width: size,
    height: size,
  }

  const IconProps = {
    iconStyles,
    activeColor,
    defaultColor,
  }

  const getShape = (style: string): JSX.Element => {
    if (shape === 'custom' && fillIcon && emptyIcon) {
      return style === 'full' ? fillIcon(IconProps) : emptyIcon(IconProps)
    }
    switch (shape) {
      case 'heart':
        if (style === 'full') return <HeartFullIcon {...IconProps} />
        return <HeartEmptyIcon {...IconProps} />

      default:
        if (style === 'full') return <FullStar {...IconProps} />
        return <EmptyStar {...IconProps} />
    }
  }

  return (
    <div style={{ display: 'flex' }} className='rcr-component-wrapper'>
      <div
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={ratingContainerRef}
        style={{
          display: 'flex',
          gap: spacing,
          position: 'relative',
          cursor: readOnly ? 'default' : 'pointer',
          lineHeight: 0,
          boxSizing: 'border-box',
          padding: 0,
          margin: 0,
        }}
      >
        {new Array(count).fill('').map((_, index) => {
          const activeState = isHovered ? hoverActiveIcon : activeIcon

          const showEmptyIcon = activeState === -1 || activeState < index + 1

          const isActiveRating = activeState !== 1
          const isRatingWithPrecision = activeState % 1 !== 0
          const isRatingEqualToIndex = Math.ceil(activeState) === index + 1
          const showRatingWithPrecision = isActiveRating && isRatingWithPrecision && isRatingEqualToIndex

          return (
            <div
              style={{
                position: 'relative',
                cursor: readOnly ? 'default' : 'pointer',
              }}
              key={index}
              title={showTitle ? titleArray[index] : ''}
            >
              <div
                style={{
                  color: activeColor,
                  width: showRatingWithPrecision ? `${(activeState % 1) * 100}%` : '0%',
                  overflow: 'hidden',
                  position: 'absolute',
                }}
              >
                {getShape('full')}
              </div>
              <div style={{ color: activeColor }}>{showEmptyIcon ? getShape('empty') : getShape('full')}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Rating
