import { createMountPoints } from './createMountPoints.mjs';
import { createUnitFiles } from './createUnitFiles.mjs';
import { enableUnitFiles } from './enableUnitFiles.mjs';
import { startUnitFiles } from './startUnitFiles.mjs';

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

    console.log('You will be prompted, unless cached, for your password in order to create, enable, and/or start units.');

    if (credentialFile) {
      console.log('When using a credentials file be sure to check permissions on the file to ensure restricted access is maintained.')
    }

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
  } catch(e) {
    console.error('The following error was encountered:')
    console.error(e);
  }
}