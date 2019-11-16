const path = require('path');
const Scripts = require('../../scripts');

const scripts = new Scripts({
  testDirectory: path.join(__dirname),
  silent: true,
});

it.each(['serve', 'start'])('css inclusion %s', async command => {
  await scripts[command](async () => {
    await page.goto('http://localhost:3000');

    const result = await page.$eval('#json-inclusion', elm => elm.textContent);

    expect(result).toBe('This is an abstract.');
  });
});
