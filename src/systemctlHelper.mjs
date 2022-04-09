import { exec } from 'child_process';

/**
 * Executes systemctl commands for a given action and unit filenames.
 * 
 * @async
 * @param {string} systemctlAction Action for systemctl command to trigger.
 * @param {Array}  unitFilenames   Array of filenames/units to run action against.
 */
export async function systemctlExec(systemctlAction, unitFilenames) {
  const systemctlPromises = unitFilenames.map(
    (unitFilename) => new Promise(
      (resolve) => exec(
        `sudo systemctl ${systemctlAction} ${unitFilename}`,
        (error, stdout, stderr) => resolve(error || stderr || stdout),
      ),
    ),
  );

  (await Promise.allSettled(systemctlPromises)).forEach(({ status, value }) => {
    if (
      status !== 'fulfilled'
      && value
    ) {
      console.warn(value);
    }
  });
}

/**
 * Uses systemctl to disable provided unit file names, if clean option is true.
 * 
 * @param {object}  options               Systemd-my-smb options object.
 * @param {boolean} options.clean         Stop, disable, and delete shares, if true.
 * @param {Array}   options.unitFilenames Array of filenames/units to disable.
 */
export async function disableUnitFiles({ clean, unitFilenames }) {
  if (clean) {
    await systemctlExec('disable', unitFilenames);
  }
}

/**
 * Uses systemctl to enable provided unit file names, if enable units is true.
 * 
 * @param {object}  options               Systemd-my-smb options object.
 * @param {boolean} options.enableUnits   Enables all generated unit files, if true.
 * @param {Array}   options.unitFilenames Array of filenames/units to stop.
 */
export async function enableUnitFiles({ enableUnits, unitFilenames }) {
  if (enableUnits) {
    await systemctlExec('enable', unitFilenames);
  }
}

/**
 * Uses systemctl to start provided unit file names, if start units is true.
 * 
 * @param {object}  options               Systemd-my-smb options object.
 * @param {boolean} options.startUnits    Starts all generated unit files, if true.
 * @param {Array}   options.unitFilenames Array of filenames/units to stop.
 */
export async function startUnitFiles({ startUnits, unitFilenames }) {
  if (startUnits) {
    await systemctlExec('start', unitFilenames);
  }
}

/**
 * Uses systemctl to stop provided unit file names, if clean option is true.
 * 
 * @param {object}  options               Systemd-my-smb options object.
 * @param {boolean} options.clean         Stop, disable, and delete shares, if true.
 * @param {Array}   options.unitFilenames Array of filenames/units to stop.
 */
export async function stopUnitFiles({ clean, unitFilenames }) {
  if (clean) {
    await systemctlExec('stop', unitFilenames);
  }
}
