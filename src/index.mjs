import { createMountPoints } from './createMountPoints.mjs';
import { createUnitFiles } from './createUnitFiles.mjs';
import {
  disableUnitFiles,
  enableUnitFiles,
  startUnitFiles,
  stopUnitFiles,
} from './systemctlHelper.mjs';

/**
 * Generates unit files for smb shares from provided options.
 * 
 * @param {object}  options                      Systemd-my-smb options object.
 * @param {string}  options.charSet              Character set to use for shares.
 * @param {boolean} options.clear                Stop, disable, and delete shares, if true.
 * @param {string}  options.credentialFile       Credential file path.
 * @param {string}  options.directoryMode        Directory mode to use for share directories.
 * @param {string}  options.domain               Domain to use for shares.
 * @param {boolean} options.enableUnits          Enables all generated unit files, if true.
 * @param {string}  options.extraOptions         Extra options for unit file for shares.
 * @param {string}  options.fileMode             File mode to use for share files.
 * @param {boolean} options.mountAsRoot          Mount the shares as root instead of current user.
 * @param {string}  options.password             Password to use for SMB authenticaiton.
 * @param {string}  options.permissions          Permissions to apply to share (rw/ro).
 * @param {string}  options.rootDirectory        Directory root where smb shares will be stored.
 * @param {Array}   options.shares               Array of smb share names.
 * @param {string}  options.smbHost              Hostname or IP of the SMB server.
 * @param {boolean} options.startUnits           Starts all generated unit files, if true.
 * @param {string}  options.systemdUnitDirectory Path to save unit files to after generation.
 * @param {number}  options.timeout              Timeout, in seconds, to wait for smb mount to complete.
 * @param {string}  options.user                 User to use for SMB authentication.
 */
export async function systemdMySmb(options) {
  // extract password so it is only used by relevant modules
  let { password } = options;
  const { credentialFile } = options;
  if (password) {
    options.password = null;
  }

  try {
    // create local mount points to mount smb shares to
    await createMountPoints(options);

    console.log('You will be prompted, unless cached, for your password in order to create/delete, enable/disable, and/or start/stop units.');

    if (credentialFile) {
      console.log('When using a credentials file be sure to check permissions on the file to ensure restricted access is maintained.')
    }

    if(options.clean) {
      const unitFilenames = [];

      // stop services
      await stopUnitFiles({ ...options, unitFilenames });

      // disable services
      await disableUnitFiles({ ...options, unitFilenames });

      // delete unit files
    } else {
      // generate unit files and place in systemd target directory
      const unitFileOptions = { ...options, password };
      const unitFilenames = await createUnitFiles(unitFileOptions);
  
      // clear password in memory
      unitFileOptions.password = null;
      password = null;

  
      // enable services
      await enableUnitFiles({ ...options, unitFilenames });
  
      // start services
      await startUnitFiles({ ...options, unitFilenames });
    }
  } catch(e) {
    console.error('The following error was encountered:')
    console.error(e);
  }
}