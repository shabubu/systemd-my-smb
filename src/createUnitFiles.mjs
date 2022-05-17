import { exec } from 'child_process';
import { generateUnitPath } from './shareHelper.mjs'
import { unitTemplate } from './unitTemplate.mjs';

/**
 * Creates new unit file from template and saves into provided systemd directory.
 * 
 * @async
 * @param {object}  options                      Systemd-my-smb options object.
 * @param {string}  options.charSet              Character set to use for shares.
 * @param {string}  options.credentialFile       Credential file path.
 * @param {string}  options.directoryMode        Directory mode to use for share directories.
 * @param {string}  options.domain               Domain to use for shares.
 * @param {string}  options.extraOptions         Extra options for unit file for shares.
 * @param {string}  options.fileMode             File mode to use for share files.
 * @param {boolean} options.mountAsRoot          Mount the shares as root instead of current user.
 * @param {string}  options.password             Password to use for SMB authenticaiton.
 * @param {string}  options.permissions          Permissions to apply to share (rw/ro).
 * @param {string}  options.rootDirectory        Directory root where smb shares will be stored.
 * @param {Array}   options.shares               Array of smb share names.
 * @param {string}  options.smbHost              Hostname or IP of the SMB server.
 * @param {string}  options.systemdUnitDirectory Path to save unit files to after generation.
 * @param {number}  options.timeout              Timeout, in seconds, to wait for smb mount to complete.
 * @param {string}  options.user                 User to use for SMB authentication.
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