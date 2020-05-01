import { render } from '@testing-library/react'
import React from 'react'
import { ClassComponent } from './ClassComponent'

describe('<ClassComponent />', () => {
  it('should render the component', () => {
    const { container } = render(<ClassComponent />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
