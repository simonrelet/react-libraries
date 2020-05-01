import { render, waitForElement } from '@testing-library/react'
import React from 'react'
import { DynamicImport } from './DynamicImport'

function Fallback() {
  return <p>Fallback</p>
}

describe('<DynamicImport />', () => {
  it('should render the fallback component', () => {
    const { container } = render(
      <React.Suspense fallback={<Fallback />}>
        <DynamicImport data-testid="lazy-component" />
      </React.Suspense>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render the component', async () => {
    const { container, getByTestId } = render(
      <React.Suspense fallback={<Fallback />}>
        <DynamicImport data-testid="lazy-component" />
      </React.Suspense>,
    )

    await waitForElement(() => getByTestId('lazy-component'))
    expect(container.firstChild).toMatchSnapshot()
  })
})
