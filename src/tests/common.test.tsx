import * as React from 'react'
import { render } from '@testing-library/react'

import 'jest-canvas-mock'
import Rating from '../Rating'

describe('Common render', () => {
    it('renders without crashing', () => {
        render(<Rating defaultValue={2} />)
    })
})