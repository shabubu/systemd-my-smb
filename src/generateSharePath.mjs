import path from 'path';

export function generateSharePath({rootDirectory, smbHost, share}) {
  return path.join(rootDirectory, smbHost, share);
}