import path from 'path';
import { exec } from 'child_process';
import generateSharePath from './generateSharePath.mjs'
import unitTemplate from './unitTemplate.mjs';

export default async function createUnitFiles(options) {
  const {
    shares,
    systemdUnitDirectory,
   } = options;
  const unitFilenames = [];

  const createPromises = shares.map((share) => new Promise((resolve, reject) => {
      // build unit file path
      let shareOptions = { ...options, share };
      const sharePath = generateSharePath(shareOptions);
      const trimmedSharePath = sharePath[0] === path.sep ? sharePath.substring(1) : sharePath;
      const unitFilename = `${trimmedSharePath.replaceAll(path.sep, '-')}.mount`;
      const unitPath = path.join(systemdUnitDirectory, unitFilename);
  
      // write out generated unit file to systemd target
      exec(
        `sudo rm -f ${unitPath} && sudo sh -c "echo '${unitTemplate(shareOptions)}' >> ${unitPath}"`,
        (error, stdout, stderr) => {
          // overwrite password in memory for share options
          shareOptions = null;

          if (error) {
            return reject(error);
          } else if (stderr) {
            return reject(stderr);
          }

          unitFilenames.push(unitFilename);

          resolve(stdout);
        },
      );
    })
  );

  await Promise.all(createPromises);

  // overwrite password in options
  options.password = null;
  
  return unitFilenames;
}