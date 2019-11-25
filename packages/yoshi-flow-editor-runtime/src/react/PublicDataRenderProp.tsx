import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { PublicDataContext, IPublicDataContext } from './PublicDataContext';

export class PublicData extends React.Component<
  InferProps<typeof PublicData.propTypes>
> {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  render() {
    const {children}: {children: (x: IPublicDataContext)=>React.Component} = this.props
    return (
      <PublicDataContext.Consumer>
        {publicData => {
          return children(publicData);
        }}
      </PublicDataContext.Consumer>
    );
  }
}
