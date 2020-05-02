import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

export function Button({ variant, className, ...rest }) {
  return (
    <button
      {...rest}
      className={classNames('Button', `Button--${variant}`, className)}
    />
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['default', 'primary', 'secondary']),
  className: PropTypes.string,
}

Button.defaultProps = {
  variant: 'default',
}
