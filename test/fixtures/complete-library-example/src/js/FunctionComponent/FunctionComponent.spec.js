import { render } from '@testing-library/react'
import React from 'react'
import { FunctionComponent } from './FunctionComponent'

describe('<FunctionComponent />', () => {
  it('should render the component', () => {
    const { container } = render(<FunctionComponent string="" bool={true} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
