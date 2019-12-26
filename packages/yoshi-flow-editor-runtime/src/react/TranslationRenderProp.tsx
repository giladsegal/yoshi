import React from 'react';
import PropTypes, { InferProps } from 'prop-types';

class TranslateComponent extends React.Component<
  InferProps<typeof TranslateComponent.propTypes>
> {
  static propTypes = {
    children: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t, children } = this.props;
    return <>{children(t)};</>;
  }
}

export const Translation = TranslateComponent;
