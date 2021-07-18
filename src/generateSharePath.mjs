import path from 'path';

export default function generateSharePath({rootDirectory, smbHost, share}) {
  return path.join(rootDirectory, smbHost, share);
}