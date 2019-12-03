import fs from 'fs';
import path from 'path';
import { Application } from 'express';
import httpTestkit from '@wix/wix-http-testkit';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Dictionary } from '../types';
import velocityDataPrivate from './velocity.private.data.json';
import velocityData from './velocity.data.json';
import renderVM from './vm';

const server = httpTestkit.server({
  port: process.env.PORT ? Number(process.env.PORT) : undefined,
  ssl: {
    cert: fs.readFileSync(
      path.join(__dirname, './certificates/cert.pem'),
      'utf-8',
    ),
    key: fs.readFileSync(
      path.join(__dirname, './certificates/key.pem'),
      'utf-8',
    ),
    passphrase: '1234',
  } as any,
});

const app: Application = server.getApp();

app.use(bodyParser.json());
app.use(cors());

app.get(
  '/_api/wix-laboratory-server/laboratory/conductAllInScope',
  (req, res) => {
    const experiments = {
      ...velocityData.experiments,
      ...velocityDataPrivate.experiments,
    };
    res.json(experiments);
  },
);

app.use('/*editorApp', (req, res) => {
  let editorAppBundle = 'editorApp';
  const matches = /\/(?<widgetName>.*)EditorApp/.exec(req.baseUrl);
  if (matches) {
    editorAppBundle = `${(matches as any).groups.widgetName}EditorMode`;
  }
  res.send(renderVM('./src/templates/editorApp.vm', { editorAppBundle }));
});

app.use('/*settingsPanel', (req, res) => {
  let settingsBundle = 'settingsPanel';
  const matches = /\/(?<widgetName>.*)SettingsPanel/.exec(req.baseUrl);
  if (matches) {
    settingsBundle = `${(matches as any).groups.widgetName}SettingsPanel`;
  }
  res.send(renderVM('./src/templates/settingsPanel.vm', { settingsBundle }));
});

const state: Dictionary<string> = {};

app.get('/state', (req, res) => {
  res.json(state[req.query.userId]);
});

app.post('/state', (req, res) => {
  state[req.query.userId] = req.body;
  res.json({ success: true });
});

const settings: Dictionary<string> = {};

const defaultSettings = {
  title: 'My TODO App!',
};

app.get('/settings', (req, res) => {
  const { instanceId } = req.query;

  res.json(settings[instanceId] || defaultSettings);
});

app.post('/settings', (req, res) => {
  const { instanceId } = req.query;
  settings[instanceId] = req.body;

  res.json({ success: true });
});

// Launch the server
server.start().then(
  () => {
    console.info(`Fake server is running on port ${server.getUrl()}`);
  },
  err => {
    console.error(
      `Fake server failed to start on port ${process.env.PORT}: ${err.message}`,
    );
  },
);
