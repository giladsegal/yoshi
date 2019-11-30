import React from 'react';
import { ControllerContext, IControllerContext } from './ControllerContext';

interface IControllerProvider {
  data: IControllerContext;
  children: React.Component | React.ReactElement;
}

export class ControllerProvider extends React.Component<IControllerProvider> {
  render() {
    return (
      <ControllerContext.Provider value={this.props.data}>
        {this.props.children}
      </ControllerContext.Provider>
    );
  }
}
