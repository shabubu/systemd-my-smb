#!/usr/bin/node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as commander from 'commander';
import { systemdMySmb } from '../src/index.mjs';

// For security reasons we want to initialize as let in order to overwrite memory since passwords may be included.
let program = commander.program;
const packageJsonPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../package.json');

program
  .version(JSON.parse(await fs.readFile(packageJsonPath, 'utf8')))
  .requiredOption(
    '-H, --smb-host <hostname>', 
    'SMB server hostname'
  )
  .requiredOption(
    '-s, --shares <shares>',
    'comma separated list of shares to mount with systemd',
    shares => shares.split(','),
  )
  .option(
    '-d, --root-directory <directory>',
    'root directory to mount shares in. When mounting shares they will be mounted with {root-directory}/{hostname}/{share}',
    `/home/${process.env.USER}`,
  )
  .option(
    '-ud, --systemd-unit-directory <directory>',
    'directory to store systemd unit files',
    '/etc/systemd/system',
  )
  .option(
    '-eu, --enable-units',
    'enables smb units after creation',
  )
  .option(
    '-su, --start-units',
    'starts smb units after creation',
  )
  .option(
    '-eo, --extra-options <options>',
    'extra options for mount',
    '',
  )
  .option(
    '-cs, --char-set <character set>',
    'mount character set option',
    'utf8',
  )
  .option(
    '-p, --permissions <permissions>',
    'mount smb permissions option',
    permissions => permissions.toLowerCase() === 'rw' ? 'rw' : 'ro',
    'ro',
  )
  .option(
    '-fm, --file-mode <mode>',
    'mount file mode option',
    '0755',
  )
  .option(
    '-dm, --directory-mode <mode>',
    'mount directory mode option',
    '0755',
  )
  .option(
    '-to, --timeout <seconds>',
    'mount timeout',
    '30',
  )
  .option(
    '-mr, --mount-as-root',
    'mounts shares as root. if not set will mount as running user'
  )
  .option(
    '-cf, --credential-file </path/to/credentials>',
    'mount credentials file path option. user, domain, and password ignored if set',
    '',
  )
  .option(
    '-u, --user <smb user>',
    'mount smb username. ignored if using credentials file',
    '',
  )
  .option(
    '-pw, --password <password>',
    'mount smb password. ignored if using credentials file',
    '',
  )
  .option(
    '-do, --domain <domain>',
    'mount smb domain. ignored if using credentials file',
    ''
  )
  .option(
    '-C, --clean',
    'stops, disables, and removes units generated for shares. Ignores all options for adding shares when enabled'
  )
  .option(
    '-A, --automount',
    'creates automount unit files (asynchronous on demand mounting)',
  )
  .parse();

const options = program.opts();
program = null;

await systemdMySmb(options);