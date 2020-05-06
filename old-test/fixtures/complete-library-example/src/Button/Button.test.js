import { render } from '@testing-library/react'
import React from 'react'
import { Button, ButtonVariants } from './Button'

describe('Button', () => {
  it('should render a button with a default variant', () => {
    const { container } = render(<Button />)
    expect(container.firstChild).toHaveClass('Button--default')
  })

  it('should apply other props', () => {
    const props = {
      className: 'custom-button',
      title: 'title',
      disabled: true,
    }

    const { container } = render(<Button {...props} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  ButtonVariants.forEach((variant) => {
    it(`should render a button with the variant "${variant}"`, () => {
      const { container } = render(<Button variant={variant} />)
      expect(container.firstChild).toHaveClass(`Button--${variant}`)
    })
  })
})
