import React from 'react'

export class ClassComponent extends React.Component {
  state = {
    string: '',
    bool: true,
  }

  propertyField = 42

  propertyMethod = () => {
    this.setState({ bool: false })
  }

  render() {
    return <p {...this.props}>ClassComponent</p>
  }
}
