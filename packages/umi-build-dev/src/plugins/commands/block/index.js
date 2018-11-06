import assert from 'assert';
import chalk from 'chalk';
import { getPathWithUrl } from './download';

const debug = require('debug')('umi-build-dev:blockPlugin');

export default api => {
  const { log } = api;

  function generate(args = {}) {
    try {
      const url = args._[0];
      assert(
        url,
        `run ${chalk.cyan.underline('umi help block')} to checkout the usage`,
      );
      const MaterialGenerate = require('./block').default(api);
      debug(`get url ${url}`);
      const sourcePath = getPathWithUrl(url, log, args);
      const { name, npmClient, dryRun } = args;
      debug(
        `get local sourcePath: ${sourcePath} and npmClient: ${npmClient} and name: ${name}`,
      );
      const generate = new MaterialGenerate(process.argv.slice(4), {
        sourcePath,
        npmClient,
        name,
        dryRun,
        env: {
          cwd: api.cwd,
        },
        resolved: __dirname,
      });

      generate
        .run()
        .then(() => {
          log.success('');
        })
        .catch(e => {
          log.error(e);
        });
    } catch (e) {
      debug(e);
      log.error(`Use block failed, ${e.message}`);
    }
  }

  const details = `
Examples:

  ${chalk.gray('# get block `demo` which in umi official blocks')}
  umi block https://github.com/umijs/umi-blocks/tree/master/demo
  `.trim();

  api.registerCommand(
    'block',
    {
      description: 'get block',
      usage: `umi block <a github/gitlab/gitrepo url> [options]`,
      options: {
        '--name': "block name, default is name in block's package.json",
        '--branch':
          'git branch, this usually does not need when you use a github url with branch itself',
        '--dry-run':
          'for test, block would have done without actually installing and download anything',
        '--npm-client':
          'use special npm client, default is npm or yarn(when yarn.lock exist in you project)',
      },
      details,
    },
    generate,
  );
};
