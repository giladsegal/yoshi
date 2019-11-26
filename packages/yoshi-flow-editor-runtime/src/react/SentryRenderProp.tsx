import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { SentryContext } from './SentryProvider';

export class Sentry extends React.Component<
  InferProps<typeof Sentry.propTypes>
> {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  render() {
    return (
      <SentryContext.Consumer>
        {sentry => this.props.children(sentry)}
      </SentryContext.Consumer>
    );
  }
}
