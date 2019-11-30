export default async ({
  platformParams,
  controllerConfigs,
  frameworkData,
}: any) => {
  console.log('InitApp');
  console.log({ platformParams, controllerConfigs, frameworkData });

  return { foo: 'bar' };
};
