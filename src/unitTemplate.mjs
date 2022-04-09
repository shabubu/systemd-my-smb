import path from 'path';

/**
 * Generates text for a unit file for smb share.
 * 
 * @param {object}  options                Systemd-my-smb options object.
 * @param {string}  options.charSet        Character set to use for shares.
 * @param {string}  options.credentialFile Credential file path.
 * @param {string}  options.directoryMode  Directory mode to use for share directories.
 * @param {string}  options.domain         Domain to use for shares.
 * @param {string}  options.extraOptions   Extra options for unit file for shares.
 * @param {string}  options.fileMode       File mode to use for share files.
 * @param {boolean} options.mountAsRoot    Mount the shares as root instead of current user.
 * @param {string}  options.password       Password to use for SMB authenticaiton.
 * @param {string}  options.permissions    Permissions to apply to share (rw/ro).
 * @param {string}  options.rootDirectory  Directory root where smb shares will be stored.
 * @param {string}  options.share          Share to specifically build unit file for.
 * @param {string}  options.smbHost        Hostname or IP of the SMB server.
 * @param {number}  options.timeout        Timeout, in seconds, to wait for smb mount to complete.
 * @param {string}  options.user           User to use for SMB authentication.
 */
export function unitTemplate(options) {
  const {
    charSet,
    credentialFile,
    directoryMode,
    domain,
    extraOptions,
    fileMode,
    mountAsRoot,
    permissions,
    rootDirectory, 
    share, 
    smbHost, 
    timeout,
    user,
  } = options;
  let { password } = options;
  const what = `//${smbHost}/${share}`
  const where = path.join(rootDirectory, smbHost, share);

  // build unit mount options
  let optionalOptions = extraOptions && extraOptions[extraOptions.length - 1] !== ',' ? `${extraOptions},` : extraOptions;
  optionalOptions = permissions === 'rw' ? `${optionalOptions}file_mode=${fileMode},dir_mode=${directoryMode},` : optionalOptions;
  optionalOptions = !mountAsRoot ? `${optionalOptions}uid=$(id -u),gid=$(id -g),` : optionalOptions;
  if (credentialFile) {
    optionalOptions = `${optionalOptions}credentials=${credentialFile},`;
  } else {
    optionalOptions = user ? `${optionalOptions}user=${user},` : optionalOptions;
    optionalOptions = password ? `${optionalOptions}password=${password},` : optionalOptions;
    optionalOptions = domain ? `${optionalOptions}domain=${domain},` : optionalOptions;
  }

  // trim any trailing comma
  if (optionalOptions.slice(-1) === ',') {
    optionalOptions = optionalOptions.slice(0, -1);
  }

  const unitFileContent = `[Unit]
  Description=${share} smb mount generated by systemd-my-smb
  After=network.target
  
[Mount]
  What=${what}
  Where=${where}
  Type=cifs
  Options=_netdev,iocharset=${charSet},${permissions}${optionalOptions ? `,${optionalOptions}` : ''}
  TimeoutSec=${timeout}
  
[Install]
  WantedBy=multi-user.target`;

  // memory security
  password = null;

  return unitFileContent;
}