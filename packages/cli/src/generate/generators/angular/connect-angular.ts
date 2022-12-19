import { join, relative } from 'path';

import { red } from 'colors/safe';
import { FileSystem } from '../../file-system';

export function connectAngular(path: string) {
  const fs = new FileSystem();

  if (!fs.exists(path)) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(red(`  The directory ${path} does not exist.`));
    }
    return;
  }

  if (!fs.exists(join(path, 'angular.json'))) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(red(`  The directory ${path} is not an Angular project (missing angular.json).`));
    }
    return;
  }

  if (!fs.exists(join(path, 'package.json'))) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(red(`  The directory ${path} is not an Angular project (missing package.json).`));
    }
    return;
  }

  fs
    .cd(path)
    .copy('angular/proxy.conf.json', 'src/proxy.conf.json')
    .modify('package.json', content => {
      const pkg = JSON.parse(content);

      pkg.scripts.build = 'ng build --prod';

      return JSON.stringify(pkg, null, 2);
    })
    .modify('angular.json', content => {
      const config = JSON.parse(content);
      let angularProject = config.defaultProject || Object.keys(config.projects)[0] || 'app';
      // Proxy configuration
//       if (config.defaultProject === undefined) {
//         console.log("NO default project (Angular>14 - use firstproject 'app'?) => ",angularProject);
//       }
      config.projects[angularProject].architect ||= {};
      config.projects[angularProject].architect.serve ||= {};
      config.projects[angularProject].architect.serve.options ||= {};
      config.projects[angularProject].architect.serve.options.proxyConfig = 'src/proxy.conf.json';
      // Output build directory
      const outputPath = (0, path_1.join)((0, path_1.relative)(path, process.cwd()), 'public')
          // Make projects generated on Windows build on Unix.
          .replace(/\\/g, '/');
      config.projects[angularProject].architect.build ||= {};
      config.projects[angularProject].architect.build.options ||= {};
      config.projects[angularProject].architect.build.options.outputPath = outputPath;
      return JSON.stringify(config, null, 2);
    });
}
