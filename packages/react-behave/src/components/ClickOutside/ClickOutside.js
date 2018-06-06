import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EventListener from 'react-event-listener';

/**
 * [create-ref]: https://reactjs.org/docs/react-api.html#reactcreateref
 *
 * > Notify for each click outside a reference HTML element.
 *
 * ## Usage
 *
 * ```jsx
 * import React, { Component } from 'react';
 * import { ClickOutside } from 'react-behave';
 *
 * class App extends Component {
 *   handleClickOutside(event) {
 *     console.log('click', event);
 *   }
 *
 *   render() {
 *     return (
 *       <ClickOutside
 *         onClickOutside={this.handleClickOutside}
 *         render={ref => <p ref={ref}>Don't click on me.</p>}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class ClickOutside extends Component {
  static propTypes = {
    /**
     * Called for each click outside the reference HTML element.
     * The parameter is the `MouseEvent` object.
     */
    onClickOutside: PropTypes.func.isRequired,

    /**
     * Render function.
     * The parameter is a [ref object][create-ref] to set on the reference HTML element.
     */
    render: PropTypes.func.isRequired,
  };

  elementRef = React.createRef();

  handleClickOutside = e => {
    const elementRef = this.elementRef.current;
    if (elementRef && !elementRef.contains(e.target)) {
      this.props.onClickOutside(e);
    }
  };

  render() {
    return (
      <EventListener target="document" onClick={this.handleClickOutside}>
        {this.props.render(this.elementRef)}
      </EventListener>
    );
  }
}

export default ClickOutside;