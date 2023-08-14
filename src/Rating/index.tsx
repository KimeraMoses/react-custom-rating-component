import React, { useState, useRef } from 'react'
import { RatingProps, svgIconStyleProps } from '../constants/interfaces'
import { EmptyStar, FullStar, HeartEmptyIcon, HeartFullIcon } from '../components'

const Rating: React.FC<RatingProps> = ({
  precision = 1,
  count = 5,
  shape = 'star',
  defaultValue = 0,
  onChange,
  onHover,
  classNames = '',
  readOnly = false,
  size = '24px',
  spacing = '5px',
  activeColor = 'orange',
  defaultColor = 'gray',
  titleArray = ['Poor', 'Good', 'Very Good', 'Best', 'Excellent'],
  showTitle = false,
}) => {
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

  const ICON_STYLES: svgIconStyleProps = {
    width: size,
    height: size,
  }

  const IconProps = {
    ICON_STYLES,
    COLOR: activeColor,
    DEFAULT_COLOR: defaultColor,
  }

  const getShape = (style: string): JSX.Element => {
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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={ratingContainerRef}
        className={`md-rating-container ${classNames} ${readOnly ? 'md-rating-container--readonly' : ''}`}
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
              className='md-rating-star'
              key={index}
              style={{
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <div
                className='md-rating-star--full'
                style={{
                  width: showRatingWithPrecision ? `${(activeState % 1) * 100}%` : '0%',
                  overflow: 'hidden',
                  position: 'absolute',
                }}
                title={showTitle ? titleArray[index] : ''}
              >
                {getShape('full')}
              </div>
              <div>{showEmptyIcon ? getShape('empty') : getShape('full')}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Rating
