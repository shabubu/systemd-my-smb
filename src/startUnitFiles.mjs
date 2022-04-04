import { exec } from 'child_process';

export async function startUnitFiles({ startUnits, unitFilenames }) {
  const enablePromises = unitFilenames.map((unitFilename) => {
    return new Promise((resolve, reject) => {
      if (!startUnits) {
        return resolve(true);
      }
  
      exec(
        `sudo systemctl start ${unitFilename}`,
        (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          } else if (stderr) {
            return reject(stderr);
          }

          resolve(stdout);
        },
      );
    });
  });

  Promise.all(enablePromises);
}