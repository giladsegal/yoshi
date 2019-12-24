import * as React from 'react';
import { render } from '@testing-library/react';
import { ExperimentsProvider } from '@wix/wix-experiments-react';
import { Widget } from './Widget';

describe('Widget', () => {
  it('should render a title correctly', async () => {
    const name = 'World';

    const { getByTestId } = render(
      <ExperimentsProvider options={{ experiments: {} }}>
        <Widget name={name} />
      </ExperimentsProvider>,
    );

    const key = 'app.hello';

    expect(getByTestId('app-title').textContent).toBe(`${key} ${name}!`);
  });
});
