import { exec } from 'child_process';
import { generateUnitPath } from './shareHelper.mjs'

/**
 * Deletes unit files in provided systemd directory.
 * 
 * @param {object} options                      Systemd-my-smb options object.
 * @param {string} options.rootDirectory        Directory root where smb shares will be stored.
 * @param {Array}  options.shares               Array of smb share names.
 * @param {string} options.smbHost              Hostname or IP of the SMB server.
 * @param {string} options.systemdUnitDirectory Path to delete unit files for systemd.
 */
export async function deleteUnitFiles(options) {
  const { shares } = options;

  const deletePromises = shares.map((share) => new Promise((resolve, reject) => {
      const unitPath = generateUnitPath({ ...options, share });
  
      exec(
        `sudo rm -f ${unitPath}`,
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

  await Promise.all(deletePromises);
}