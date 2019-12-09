import React from 'react';
import { Translation } from 'yoshi-flow-editor-runtime';
import {
  ExperimentsProvider,
  withExperiments,
} from '@wix/wix-experiments-react';
import { TPAComponentsProvider } from 'wix-ui-tpa/TPAComponentsConfig';
import { Button } from 'wix-ui-tpa/Button';
import styles from './Widget.st.css';

export default class WidgetRoot extends React.Component {
  render() {
    const { name, experiments, mobile } = this.props;

    return (
      <ExperimentsProvider options={{ experiments }}>
        <TPAComponentsProvider value={{ mobile }}>
          <Widget name={name} />
        </TPAComponentsProvider>
      </ExperimentsProvider>
    );
  }
}

export const Widget = withExperiments(({ name, ...rest }) => {
  return (
    <Translation>
      {t => (
        <div {...styles('root', {}, rest)}>
          <div className={styles.header}>
            <h2 data-testid="app-title">
              {t('app.hello')} {name}!
            </h2>
          </div>
          <Button className={styles.mainButton}>click me</Button>
        </div>
      )}
    </Translation>
  );
});
