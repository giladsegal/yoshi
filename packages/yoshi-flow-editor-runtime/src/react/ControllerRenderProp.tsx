import React from 'react';
import { ControllerContext, IControllerContext } from './ControllerContext';

interface IController {
  children: (ctrl: IControllerContext) => React.ReactNode;
}

export class Controller extends React.Component<IController> {
  render() {
    return (
      <ControllerContext.Consumer>
        {controller => this.props.children(controller)}
      </ControllerContext.Consumer>
    );
  }
}
