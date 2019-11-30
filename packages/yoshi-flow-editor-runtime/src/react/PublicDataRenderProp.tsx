import React from 'react';
import {
  PublicDataContext,
  IPublicData as IPublicDataType,
} from './PublicDataContext';

interface IPublicData {
  children: (x: IPublicDataType) => React.ReactNode;
}

export class PublicData extends React.Component<IPublicData> {
  render() {
    const { children } = this.props;
    return (
      <PublicDataContext.Consumer>
        {publicData => {
          return children((publicData as unknown) as IPublicDataType);
        }}
      </PublicDataContext.Consumer>
    );
  }
}
