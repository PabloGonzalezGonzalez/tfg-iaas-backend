import { Playbook } from 'node-ansible';
// import { stringify as jsonToYaml } from 'json-to-pretty-yaml';
import { stringify as jsonToYaml } from 'yaml';

import fs from 'fs';
import Path from 'path';
import ErrnoException = NodeJS.ErrnoException;

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

export type ActionType = 'start' | 'stop' | 'restart' | 'resetPassword';

interface VarsInterface {
  actionType?: ActionType;
  nodes?: NodesType;
  vmName?: string; // deprecated
  username?: string;
  password?: string;
  prefix?: string;
  targetUsername?: string;
  distro?: string;
  ip?: string;
  cluster?: string;
}

/* Constants */
// const LOG_SUCCESS = Path.join(
//   __dirname,
//   '..',
//   '..',
//   '.log',
//   'ansible_success.log'
// );
// const LOG_ERROR = Path.join(__dirname, '..', '..', '.log', 'ansible_error.log');
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
export const createVarsFile = (vars: VarsInterface): void => {
  // Create the final name for the virtual machine
  if (vars.nodes) {

    console.log(isCreateVMInterfaceArray(vars.nodes));
    console.log(vars);

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
  }

  fs.writeFile(VARS_FILE, jsonToYaml(vars), (error: ErrnoException | null) => {
    if (error) {
      throw error;
    }
    console.log(`\nData saved on: ${VARS_FILE}\n`);
  });
};

export const execAnsiblePlaybook2 = async (playbookFile: string): Promise<any> => {
  const playbook = new Playbook().playbook(playbookFile);
  playbook.inventory(INVENTORY_PATH);
  playbook.on('stdout', (data) => {
    console.log(data.toString());
  });
  playbook.on('stderr', (data) => {
    console.log(data.toString());
  });

  return playbook.exec();
};

export const parseInventory = (inventoryPath: string) => {
  const data = fs.readFileSync(inventoryPath, { encoding: 'utf8' });
  console.log({ data });
};
