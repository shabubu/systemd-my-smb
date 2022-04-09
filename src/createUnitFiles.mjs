import { exec } from 'child_process';
import { generateUnitPath } from './shareHelper.mjs'
import { unitTemplate } from './unitTemplate.mjs';

/**
 * Creates new unit file from template and saves into provided systemd directory.
 * 
 * @param {object} options                      Systemd-my-smb options object.
 * @param {Array}  options.shares               Array of smb share names.
 * @param {string} options.systemdUnitDirectory Path to save unit files to after generation.
 */
export async function createUnitFiles(options) {
  const { shares } = options;

  const createPromises = shares.map((share) => new Promise((resolve, reject) => {
      // build unit file path
      let shareOptions = { ...options, share };
      const unitPath = generateUnitPath(shareOptions);
  
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

          resolve(stdout);
        },
      );
    })
  );

  await Promise.all(createPromises);
}