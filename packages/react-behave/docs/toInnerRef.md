# toInnerRef(Component) ⇒ `React.Component`

[fr]: https://reactjs.org/docs/react-api.html#reactforwardref

Higher order component renaming the prop `ref` to `innerRef`.

This HOC can be seen as an abstraction over the [`React.forwardRef`][fr] API.

## Usage

```jsx
import React from 'react';
import { toInnerRef } from 'react-behave';

const MyComponent = ({ innerRef, ...props }) => (
  <div ref={innerRef} {...props} />
);

// Instead of:
export default React.forwardRef((props, ref) => (
  <MyComponent innerRef={ref} {...props} />
));

// Simply write:
export default toInnerRef(MyComponent);
```

**Returns**: `React.Component` - The wrapping component.

| Param       | Type              | Description          |
| ----------- | ----------------- | -------------------- |
| `Component` | `React.Component` | The React component. |