import path from 'path';

/**
 * Generates a full path for an individual share.
 * 
 * @param   {object} options               Systemd-my-smb options object.
 * @param   {string} options.rootDirectory Directory root where smb shares will be stored.
 * @param   {string} options.share         Share to specifically build unit file for.
 * @param   {string} options.smbHost       Hostname or IP of the SMB server.
 * @returns {string}                       Path for the share as string. 
 */
export function generateSharePath({rootDirectory, share, smbHost}) {
  return path.join(rootDirectory, smbHost, share);
}

/**
 * Generates a unit file filename for smb share.
 * 
 * @param   {object} options               Systemd-my-smb options object.
 * @param   {string} options.rootDirectory Directory root where smb shares will be stored.
 * @param   {string} options.share         Share to specifically build unit file for.
 * @param   {string} options.smbHost       Hostname or IP of the SMB server.
 * @param   {string} options.unitExtension Extension to use for unit file.
 * @returns {string}                       Path for the unit file as string. 
 */
 export function generateUnitFilename(shareOptions) {
  const { unitExtension } = shareOptions;
  const sharePath = generateSharePath(shareOptions);
  const trimmedSharePath = sharePath[0] === path.sep ? sharePath.substring(1) : sharePath;

  // replace all path separators with "-"
  return `${trimmedSharePath.replace(new RegExp(path.sep,'g'), '-')}.${unitExtension}`;
}

/**
 * Generates a full path for a share's unit file.
 * 
 * @param   {object} options                      Systemd-my-smb options object.
 * @param   {string} options.rootDirectory        Directory root where smb shares will be stored.
 * @param   {string} options.share                Share to specifically build unit file for.
 * @param   {string} options.smbHost              Hostname or IP of the SMB server.
 * @param   {string} options.systemdUnitDirectory Path to save unit files to after generation.
 * @returns {string}                              Path for the unit file as string. 
 */
export function generateUnitPath(shareOptions) {
  const { systemdUnitDirectory } = shareOptions;
  const mountOptions = {
    ...shareOptions,
    unitExtension: 'mount'
  };

  return path.join(systemdUnitDirectory, generateUnitFilename(mountOptions));
}

/**
 * Generates a full path for a share's automount unit file.
 * 
 * @param   {object} options                      Systemd-my-smb options object.
 * @param   {string} options.rootDirectory        Directory root where smb shares will be stored.
 * @param   {string} options.share                Share to specifically build unit file for.
 * @param   {string} options.smbHost              Hostname or IP of the SMB server.
 * @param   {string} options.systemdUnitDirectory Path to save unit files to after generation.
 * @returns {string}                              Path for the unit file as string. 
 */
export function generateAutomountUnitPath(shareOptions) {
  const { systemdUnitDirectory } = shareOptions;
  const automountOptions = {
    ...shareOptions,
    unitExtension: 'automount',
  };

  return path.join(systemdUnitDirectory, generateUnitFilename(automountOptions));
}

/**
 * Generates unit file filenames for all shares.
 * 
 * @param   {object} options                      Systemd-my-smb options object.
 * @param   {string} options.rootDirectory        Directory root where smb shares will be stored.
 * @param   {Array}  options.shares               Array of smb share names.
 * @param   {string} options.smbHost              Hostname or IP of the SMB server.
 * @returns {string}                              Path for the unit file as string. 
 */
export function generateUnitFilenames(options) {
  const { shares } = options;

  return shares.map(share => generateUnitFilename({
    ...options,
    share,
    unitExtension: 'mount',
  }));
}

/**
 * Generates automount unit file filenames for all shares.
 * 
 * @param   {object} options                      Systemd-my-smb options object.
 * @param   {string} options.rootDirectory        Directory root where smb shares will be stored.
 * @param   {Array}  options.shares               Array of smb share names.
 * @param   {string} options.smbHost              Hostname or IP of the SMB server.
 * @returns {string}                              Path for the unit file as string. 
 */
export function generateAutomountUnitFilenames(options) {
  const { shares } = options;

  return shares.map(share => generateUnitFilename({
    ...options,
    share,
    unitExtension: 'automount',
  }));
}