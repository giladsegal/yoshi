import * as React from 'react';
import {
  ExperimentsProvider,
  withExperiments,
} from '@wix/wix-experiments-react';
import { Button } from 'wix-ui-tpa/Button';
import { ExperimentsBag } from '@wix/wix-experiments';
import {
  TranslationProvider,
  withTranslations,
} from '../../config/translationHoc';
import styles from './Widget.st.css';

// import { IHostProps } from '@wix/native-components-infra/dist/src/types/types';

interface IWidgetRootProps {
  name: string;
  experiments: ExperimentsBag;
  host?: any;
  translations?: Record<string, string>;
}

export default class WidgetRoot extends React.Component<IWidgetRootProps> {
  render() {
    const { name, experiments, translations } = this.props;

    return (
      <TranslationProvider value={translations}>
        <ExperimentsProvider options={{ experiments }}>
          <Widget name={name} />
        </ExperimentsProvider>
      </TranslationProvider>
    );
  }
}

export const Widget = withExperiments<any>(
  withTranslations(({ name, t, ...rest }) => {
    return (
      <div {...styles('root', {}, rest)}>
        <div className={styles.header}>
          <h2 data-testid="app-title">
            {t('app.hello')} {name}!
          </h2>
        </div>
        <Button className={styles.mainButton}>click me</Button>
      </div>
    );
  }),
);
