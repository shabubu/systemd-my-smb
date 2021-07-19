import { exec } from 'child_process';

export default async function enableUnitFiles({ enableUnits, unitFilenames }) {
  if (!enableUnits) {
    return;
  }

  const enablePromises = unitFilenames.map(
    unitFilename => new Promise((resolve, reject) => exec(
        `sudo systemctl enable ${unitFilename}`,
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

  const results = await Promise.all(enablePromises);

  console.warn(
    'systemctl outputs to stderr always, even on success; the following was received:',
    ...results,
  );
}