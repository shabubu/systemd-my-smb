import path from 'path';

/**
 * Generates a full path for an individual share using options for systemd-my-smb.
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