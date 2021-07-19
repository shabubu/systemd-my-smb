import createMountPoints from './createMountPoints.mjs';
import createUnitFiles from './createUnitFiles.mjs';
import enableUnitFiles from './enableUnitFiles.mjs';
import startUnitFiles from './startUnitFiles.mjs';

export default async function systemdMySmb(options) {
  // extract password so it is only used by relevant modules
  let { password } = options;
  if (password) {
    options.password = null;
  }

  try {
    // create local mount points to mount smb shares to
    await createMountPoints(options);

    // generate unit files and place in systemd target directory
    console.log('You will be prompted, unless cached, for your password in order to create, enable, and/or start units.');
    const unitFileOptions = { ...options, password };
    const unitFilenames = await createUnitFiles(unitFileOptions);

    // clear password in memory
    unitFileOptions.password = null;
    password = null;

    // enable services
    await enableUnitFiles({ ...options, unitFilenames });

    // start services
    await startUnitFiles({ ...options, unitFilenames });
  } catch(e) {
    console.error('The following error was encountered:')
    console.error(e);
  }
}