import { render } from '@testing-library/react'
import React from 'react'
import DefaultExport from '../DefaultExport'

describe('<DefaultExport />', () => {
  it('should render the component', () => {
    const { container } = render(<DefaultExport />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
