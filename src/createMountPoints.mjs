import { promises as fs } from 'fs';
import generateSharePath from './generateSharePath.mjs';

export default async function createMountPoints(options) {
  const { shares } = options;
  const mkdirPromises = shares.map(share => fs.mkdir(generateSharePath({ ...options, share }), { recursive: true }));

  await Promise.all(mkdirPromises);
}