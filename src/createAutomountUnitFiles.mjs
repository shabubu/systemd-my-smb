import { exec } from 'child_process';
import { generateAutomountUnitPath } from './shareHelper.mjs'
import { unitAutomountTemplate } from './unitAutomountTemplate.mjs';

/**
 * Creates new automount unit file from template and saves into provided systemd directory, if automounting is true.
 * 
 * @param {object}  options                      Systemd-my-smb options object.
 * @param {boolean} options.automount            Whether to create automount unit files.
 * @param {Array}   options.shares               Array of smb share names.
 * @param {string}  options.systemdUnitDirectory Path to save unit files to after generation.
 */
export async function createAutomountUnitFiles(options) {
  const {
    automount,
    shares,
  } = options;

  if (automount) {
    const createPromises = shares.map((share) => new Promise((resolve, reject) => {
        // build unit file path
        let shareOptions = { ...options, share };
        const unitPath = generateAutomountUnitPath(shareOptions);
    
        // write out generated unit file to systemd target
        exec(
          `sudo rm -f ${unitPath} && sudo sh -c "echo '${unitAutomountTemplate(shareOptions)}' >> ${unitPath}"`,
          (error, stdout, stderr) => {
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
}