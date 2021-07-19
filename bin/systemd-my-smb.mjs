#!/usr/bin/node
import { promises as fs } from 'fs';
import commander from 'commander';
import systemdMySmb from '../src/index.mjs';

// For security reasons we want to initialize as let in order to overwrite memory since passwords may be included.
let program = commander.program;

program
  .version(JSON.parse(await fs.readFile('package.json', 'utf8')))
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
    'extra options for unit mount',
    '',
  )
  .option(
    '-cs, --char-set <character set>',
    'unit mount character set option',
    'utf8',
  )
  .option(
    '-p, --permissions <permissions>',
    'unit mount smb permissions option',
    permissions => permissions.toLowerCase() === 'rw' ? 'rw' : 'ro',
    'ro',
  )
  .option(
    '-fm, --file-mode <mode>',
    'unit mount file mode option',
    '0777',
  )
  .option(
    '-dm, --directory-mode <mode>',
    'unit mount directory mode option',
    '0777',
  )
  .option(
    '-to, --timeout <seconds>',
    'unit mount timeout',
    '30',
  )
  .option(
    '-u, --user <smb user>',
    'smb username. ignored if using credentials file',
    '',
  )
  .option(
    '-pw, --password <password>',
    'smb password. ignored if using credentials file',
    '',
  )
  .parse();

const options = program.opts();
program = null;

await systemdMySmb(options);