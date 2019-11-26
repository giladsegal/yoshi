import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { FedopsContext } from './FedopsProvider';

export class Fedops extends React.Component<
  InferProps<typeof Fedops.propTypes>
> {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  render() {
    return (
      <FedopsContext.Consumer>
        {fedops => this.props.children(fedops)}
      </FedopsContext.Consumer>
    );
  }
}
