import mkdirp from 'mkdirp';
import generateSharePath from './generateSharePath.mjs';

export default async function createMountPoints(options) {
  const { shares } = options;
  const mkdirPromises = shares.map(share => mkdirp(generateSharePath({ ...options, share })));

  await Promise.all(mkdirPromises);
}