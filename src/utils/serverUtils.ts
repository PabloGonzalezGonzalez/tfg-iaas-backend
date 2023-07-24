import { Playbook } from 'node-ansible';
import { stringify as jsonToYaml } from 'yaml';

import fs from 'fs/promises';
import Path from 'path';

/* Interfaces */
export interface CreateVMInterface {
  name: string;
  cluster: string;
  distro: string;
  prefix: string;
  ip: string;
}

export interface SimpleVMInterface {
  fullName: string;
}

export type NodesType = CreateVMInterface[] | SimpleVMInterface[] | string[];

export type ActionType = 'start' | 'stop' | 'restart' | 'resetPassword' | 'addUser';

interface VarsInterface {
  actionType?: ActionType;
  nodes?: NodesType;
  vmName?: string;
  username?: string;
  password?: string;
  prefix?: string;
  targetUsername?: string;
  distro?: string;
  ip?: string;
  cluster?: string;
  ullUsername?: string;
  inventoryGroup?: string;
}

/* Constants */
export const LOG_SUCCESS = Path.join(
  __dirname,
  '..',
  '..',
  '.log',
  'ansible_success.log'
);
export const LOG_ERROR = Path.join(__dirname, '..', '..', '.log', 'ansible_error.log');
const VARS_FILE = Path.join(__dirname, '..', 'files', 'pabloTFG.yaml');
const INVENTORY_PATH = Path.join(__dirname, '..', 'ansible', 'inventory', 'hosts');

/* Type checkers */
const isCreateVMInterfaceArray = (obj: unknown): obj is CreateVMInterface[] =>
  Array.isArray(obj) && obj.every(isCreateVMInterface);

const isCreateVMInterface = (obj: unknown): obj is CreateVMInterface => {
  const keys = Object.keys(obj as CreateVMInterface);
  return obj != null && keys.includes('name') && keys.includes('cluster')
    && keys.includes('distro') && keys.includes('prefix')
    && keys.every((key) => typeof (obj as any)[key] === 'string');
};

/* Helpers */
const createObjectFromString = (stringArray: string[]) => {
  const finalArray = [] as SimpleVMInterface[];
  stringArray.forEach((element) => {
    finalArray.push({ fullName: element });
  });

  return finalArray;
};

/* Functions */
export const createVarsFile = async (vars: VarsInterface): Promise<void> => {
  // Create the final name for the virtual machine
  if (vars.nodes) {
    // Case: nodes are coming like CreateVMInterface[]
    if (isCreateVMInterfaceArray(vars.nodes)) {
      vars.nodes.map((node) => node['fullName'] = node.prefix
        ? `${node.prefix}-${node.name}`
        : node.name);
    }
    // Case: nodes are coming like string[]
    else {
      vars.nodes = createObjectFromString(vars.nodes as string[]);
    }
  }

  // Set username to 'usuario' by default
  if (vars.actionType === 'resetPassword') {
    if (!vars.targetUsername) {
      vars.targetUsername = 'usuario';
    }
    if (vars.ullUsername) {
      vars.inventoryGroup = `${vars.vmName}.${vars.ullUsername}.ull.lan`;
    }
  }

  try {
    await fs.writeFile(VARS_FILE, jsonToYaml(vars));
    console.log(`\nData saved on: ${VARS_FILE}\n`);
  } catch (err) {
    console.error('Error: ', err);
    throw err;
  }
};

export const execAnsiblePlaybook = async (playbookFile: string, username?: string): Promise<any> => {
  const playbook = new Playbook().playbook(playbookFile);
  const inventory = username ? `${INVENTORY_PATH}-${username}` : INVENTORY_PATH;
  console.log({ inventory });
  playbook.inventory(inventory);
  playbook.on('stdout', (data) => {
    console.log(data.toString());
  });
  playbook.on('stderr', (data) => {
    console.log(data.toString());
  });

  return playbook.exec();
};
