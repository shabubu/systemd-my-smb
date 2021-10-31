# systemd-my-smb

Systemd-my-smb is a command line application that will automatically create systemd unit files to mount SMB user share(s).

## Example

## Options
<table>
  <thead>
    <tr>
      <th>Arguments</th>
      <th>Description</th>
      <th>Example<t/h>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>-V, --version</td>
      <td>Outputs the systemd-my-smb application version.</td>
      <td><code>-V</code></td>
    </tr>
    <tr>
      <td>-h, --help</td>
      <td>Outputs the systemd-my-smb application options and descriptions.</td>
      <td><code>-h</code></td>
    </tr>
    <tr>
      <td>-H, --smb-host</td>
      <td>Required. Hostname or IP Address of SMB Server to Mount shares from.</td>
      <td><code>-H MyShare.local</code></td>
    </tr>
    <tr>
      <td>-s, --shares</td>
      <td>Required. A comma separated list of shares to mount from the SMB host.</td>
      <td><code>-s photos,videos</code></td>
    </tr>
    <tr>
      <td>-d, --root-directory</td>
      <td>Root directory for shares. Will automatically attempt to create {root directory}/{SMB hostname}/{share name}. <b>Default:</b> <code>/home/{username}</code></td>
      <td><code>-d /smb_shares</code></td>
    </tr>
    <tr>
      <td>-ud, --systemd-unit-directory</td>
      <td>Directory to store systemd unit files within. <b>Default:</b> <code>/etc/systemd/system</code></td>
      <td><code>-ud /etc/systemd/system</code></td>
    </tr>
  </tbody>
</table>

```
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
```