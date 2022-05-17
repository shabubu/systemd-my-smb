import { promises as fs } from 'fs';
import { generateSharePath } from './shareHelper.mjs';

/**
 * Creates local directories to mount shares to.
 * 
 * @async
 * @param {object} options        Systemd-my-smb options object.
 * @param {string} options.rootDirectory Directory root where smb shares will be stored.
 * @param {Array}  options.shares Array of smb share names.
 * @param {string} options.smbHost       Hostname or IP of the SMB server.
 */
export async function createMountPoints(options) {
  const { shares } = options;
  const mkdirPromises = shares.map(share => fs.mkdir(generateSharePath({ ...options, share }), { recursive: true }));

  await Promise.all(mkdirPromises);
}