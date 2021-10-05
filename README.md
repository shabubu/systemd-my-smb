# systemd-my-smb

Full readme coming soon

```
Usage: systemd-my-smb [options]

Options:
  -V, --version                                  output the version number
  -H, --smb-host <hostname>                      SMB server hostname
  -s, --shares <shares>                          comma separated list of shares to mount with systemd
  -d, --root-directory <directory>               root directory to mount shares in. When mounting shares they will be mounted with {root-directory}/{hostname}/{share} (default: "/home/$USER")
  -ud, --systemd-unit-directory <directory>      directory to store systemd unit files (default: "/etc/systemd/system")
  -eu, --enable-units                            enables smb units after creation
  -su, --start-units                             starts smb units after creation
  -eo, --extra-options <options>                 extra options for unit mount (default: "")
  -cs, --char-set <character set>                unit mount character set option (default: "utf8")
  -p, --permissions <permissions>                unit mount smb permissions option (default: "ro")
  -fm, --file-mode <mode>                        unit mount file mode option (default: "0755")
  -dm, --directory-mode <mode>                   unit mount directory mode option (default: "0755")
  -to, --timeout <seconds>                       unit mount timeout (default: "30")
  -mr, --mount-as-root                           mounts shares as root. if not set will mount as running user
  -cf, --credential-file </path/to/credentials>  unit mount credentials file path option. user, domain, and password ignored if set (default: "")
  -u, --user <smb user>                          unit mount smb username. ignored if using credentials file (default: "")
  -pw, --password <password>                     unit mount smb password. ignored if using credentials file (default: "")
  -do, --domain <domain>                         unit mount smb domain. ignored if using credentials file. (default: "")
  -h, --help                                     display help for command
```