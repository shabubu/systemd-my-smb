import path from 'path';

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