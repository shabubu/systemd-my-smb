# systemd-my-smb

Systemd-my-smb is a command line application that will automatically create systemd unit files to mount SMB user share(s). Whether you are new to Linux or wanting to automate mount your shares, systemd-my-smb is here to help you manage your smb systemd unit files.

## Installation
```bash
$ npm i -g systemd-my-smb
```

## Examples
### No credentials
```bash
$ systemd-my-smb --smb-host MYSERVER --shares photos,movies,books --enable-units --start-units
```

### Username and Password
```bash
$ systemd-my-smb --smb-host MYSERVER --shares photos,movies,books --enable-units --start-units --permissions rw --user myuser --password 0ABadPass!
```

### Credentials File (Recommended)
```bash
$ systemd-my-smb --smb-host MYSERVER --shares photos,movies,books --enable-units --start-units --permissions rw --credential-file /home/myuser/.myserver_credentials
```

### Unmount and Remove Shares
```bash
$ systemd-my-smb --smb-host MYSERVER --shares photos,movies,books --clean
```

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
    <tr>
      <td>-eu, --enable-units</td>
      <td>Enables SMB units after creation.</td>
      <td><code>-eu</code></td>
    </tr>
    <tr>
      <td>-su, --start-units</td>
      <td>Starts SMB units after creation.</td>
      <td><code>-su</code></td>
    </tr>
    <tr>
      <td>-A, --automount</td>
      <td>Creates automount unit files (asynchronous on demand mounting). Do not confuse with mounting on startup. Read more [here](https://www.man7.org/linux/man-pages/man5/systemd.automount.5.html).</td>
      <td><code>-A</code></td>
    </tr>
    <tr>
      <td>-eo, --extra-options</td>
      <td>Extra options for unit mount. <b>Default:</b> <code>""</code></td>
      <td><code>-eo {mount option}</code></td>
    </tr>
    <tr>
      <td>-cs, --char-set</td>
      <td>Character set option for smb mount. <b>Default:</b> <code>utf8</code></td>
      <td><code>-cs utf8</code></td>
    </tr>
    <tr>
      <td>-p, --permissions</td>
      <td>Mount permission for smb mount. <b>Default:</b> <code>ro</code></td>
      <td><code>-p rw</code></td>
    </tr>
    <tr>
      <td>-fm, --file-mode</td>
      <td>File mode for smb mount. <b>Default:</b> <code>0755</code></td>
      <td><code>-fm 0777</code></td>
    </tr>
    <tr>
      <td>-dm, --directory-mode</td>
      <td>Directory mode for smb mount. <b>Default:</b> <code>0755</code></td>
      <td><code>-dm 0777</code></td>
    </tr>
    <tr>
      <td>-to, --timeout</td>
      <td>Timeout, in seconds, for smb mount. <b>Default:</b> <code>30</code></td>
      <td><code>-to 10</code></td>
    </tr>
    <tr>
      <td>-mr, --mount-as-root</td>
      <td>Mounts shares as root. Default behavior mounts shares as user running systemd-my-smb.
      <td><code>-mr</code></td>
    </tr>
    <tr>
      <td>-cf, --credential-file</td>
      <td>Path to credential file to use for mount. User, domain, and password options ignored when using credential file. <b>Default:</b> <code>""</code>
      <td><code>-cf /home/myuser/.mysmb_credentials</code></td>
    </tr>
    <tr>
      <td>-u, --user</td>
      <td>SMB username for mount. <b>Default:</b> <code>""</code>
      <td><code>-u myuser</code></td>
    </tr>
    <tr>
      <td>-pw, --password</td>
      <td>SMB password for mount. <b>Note:</b> Please consider using a credential file over this option. <b>Default:</b> <code>""</code>
      <td><code>-pw 0aBadPassword!</code></td>
    </tr>
    <tr>
      <td>-do, --domain</td>
      <td>SMB domain for mount. <b>Default:</b> <code>""</code>
      <td><code>-do workgroup</code></td>
    </tr>
    <tr>
      <td>-C, --clean</td>
      <td>Stops, disables, and removes units generated for shares. Ignores all options for adding shares when enabled.</td>
      <td><code>-C</code></td>
    </tr>
  </tbody>
</table>

## Development
### Running in development mode
To run in development just use `npm run dev` and supply your arguments.
```bash
$ npm run dev -- --smb-host MYSERVER --shares photos,movies,books
```

### Updating dependencies
Run `npm run update-dependencies` which will upgrade all packages in package.json, install, and update package-lock.json.

### Publishing Releases
Systemd-my-smb uses `release-it` for releasing. Use the following syntax for releases: `npm run release major|minor|patch`.

### Tests
Where are the tests!? This project was started with the goal of no transpilation while using native module support in Node. Unfortunately, there are only
experimental ways to mock these modules. Without proper mocking support, testing is on hold.