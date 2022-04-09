import { promises as fs } from 'fs';
import { generateSharePath } from './shareHelper.mjs';

/**
 * Creates local directories to mount shares to.
 * 
 * @param {object} options        Systemd-my-smb options object.
 * @param {Array}  options.shares Array of smb share names.
 */
export async function createMountPoints(options) {
  const { shares } = options;
  const mkdirPromises = shares.map(share => fs.mkdir(generateSharePath({ ...options, share }), { recursive: true }));

  await Promise.all(mkdirPromises);
}