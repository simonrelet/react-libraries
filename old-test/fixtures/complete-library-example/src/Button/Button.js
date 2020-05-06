import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

export const ButtonVariants = ['default', 'primary', 'secondary']

export function Button({ variant, className, ...rest }) {
  return (
    <button
      {...rest}
      className={classNames('Button', `Button--${variant}`, className)}
    />
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(ButtonVariants),
  className: PropTypes.string,
}

Button.defaultProps = {
  variant: ButtonVariants[0],
}
