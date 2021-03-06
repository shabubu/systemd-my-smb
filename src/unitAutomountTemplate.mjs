import path from 'path';

/**
 * Generates text for a automount unit file for smb share.
 * 
 * @param {object} options               Systemd-my-smb options object.
 * @param {string} options.rootDirectory Directory root where smb shares will be stored.
 * @param {string} options.share         Share to specifically build unit file for.
 * @param {string} options.smbHost       Hostname or IP of the SMB server.
 */
export function unitAutomountTemplate(options) {
  const {
    rootDirectory, 
    share, 
    smbHost,
  } = options;
  const where = path.join(rootDirectory, smbHost, share);

  return `[Unit]
  Description=${share} smb automount generated by systemd-my-smb
  Requires=network-online.target
  
[Automount]
  Where=${where}
  TimeoutIdleSec=0
  
[Install]
  WantedBy=multi-user.target`;
}