import React from 'react'

const LazyComponent = React.lazy(() => import('./LazyComponent'))

export function DynamicImport(props) {
  return <LazyComponent {...props} />
}
