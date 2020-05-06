import PropTypes from 'prop-types'
import React from 'react'

export function FunctionComponent({ bool, string, number = 0, object }) {
  const { a, b, c } = object
  return <p>{JSON.stringify({ a, b, c, bool, string, number })}</p>
}

FunctionComponent.propTypes = {
  bool: PropTypes.bool.isRequired,
  string: PropTypes.string.isRequired,
  number: PropTypes.number,
  object: PropTypes.object,
}

FunctionComponent.defaultProps = {
  object: {},
}
