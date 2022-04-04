import { exec } from 'child_process';

export async function systemctlExec(systemctlAction, unitFilenames) {
  const systemctlPromises = unitFilenames.map(
    (unitFilename) => new Promise(
      (resolve, reject) => exec(
        `sudo systemctl ${systemctlAction} ${unitFilename}`,
        (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          } else if (stderr) {
            return resolve(stderr);
          }

          resolve(stdout);
        },
      ),
    ),
  );

  console.warn(...await Promise.allSettled(systemctlPromises));
}

export async function enableUnitFiles({ startUnits, unitFilenames }) {
  if (startUnits) {
    systemctlExec('enable', unitFilenames);
  }
}

export async function startUnitFiles({ startUnits, unitFilenames }) {
  if (startUnits) {
    systemctlExec('start', unitFilenames);
  }
}
