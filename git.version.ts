import { writeFileSync } from 'fs';
import * as gitCommitInfo from 'git-commit-info';
import { dedent } from 'tslint/lib/utils';

async function createVersionsFile(filename: string) {
  const git = gitCommitInfo();
  const content = dedent`
      // this file is automatically generated by git.version.ts script
      export const versions = {
        version: '${process.env.npm_package_version}',
        revision: '${git.shortHash}',
        release: '${git.date}'
      };`;

  writeFileSync(filename, content, { encoding: 'utf8' });
}

createVersionsFile('src/environments/versions.ts');
