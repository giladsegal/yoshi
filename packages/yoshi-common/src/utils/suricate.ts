import url from 'url';
import { socket } from '@wix/suricate-client';
import getGitConfig from 'parse-git-config';

const getPathname = (stringUrl: string) => url.parse(stringUrl).pathname;

const suricateURL = 'https://bo.wix.com/suricate';

const WIX_EMAIL_PATTERN = '@wix.com';

const getTunnelId = (namespace: string) => {
  const gitConfig = getGitConfig.sync({ include: true, type: 'global' });
  const gitEmail = gitConfig.user ? gitConfig.user.email : '';
  const processUser = process.env.USER;
  let uniqueTunnelId;
  if (gitEmail.endsWith(WIX_EMAIL_PATTERN)) {
    uniqueTunnelId = gitEmail.replace(WIX_EMAIL_PATTERN, '');
  } else if (processUser) {
    uniqueTunnelId = processUser;
  } else if (process.env.SURICATE_TUNNEL_ID) {
    uniqueTunnelId = process.env.SURICATE_TUNNEL_ID;
  } else {
    return undefined;
  }

  const normalizedNamespace = namespace.replace('/', '-');

  return `${uniqueTunnelId}.${normalizedNamespace}`;
};

export const getSocket = (namespace: string, targetPort?: number) => {
  const targetPortObj = targetPort ? { target: { port: targetPort } } : {};

  console.log({
    ...targetPortObj,
    url: suricateURL,
    tunnelID: getTunnelId(namespace),
  });

  return socket({
    ...targetPortObj,
    url: suricateURL,
    tunnelID: getTunnelId(namespace),
  });
};

export const getUrl = (namespace: string) =>
  `${suricateURL}/tunnel/${getTunnelId(namespace)}/`;

export const getDevServerUrl = (appName: string) =>
  getUrl(`${appName}-dev-server`);

export const getDevServerSocket = (appName: string) =>
  getSocket(`${appName}-dev-server`);

//https://bo.wix.com/suricate/tunnel/rany.@wix-generated/?sockPath=/suricate/tunnel/rany.@wix-generated/sockjs-node
export const getDevServerSocketPath = (appName: string) => {
  const devServerUrl = getDevServerUrl(appName);
  console.log(
    `${devServerUrl}?&sockPath=${getPathname(devServerUrl)}sockjs-node`,
  );
  return `${devServerUrl}?&sockPath=${getPathname(devServerUrl)}sockjs-node`;
};
