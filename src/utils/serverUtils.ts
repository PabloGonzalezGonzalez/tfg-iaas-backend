import { Playbook } from 'node-ansible';
import { stringify as jsonToYaml } from 'json-to-pretty-yaml';

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
}

/* Constants */
const LOG_SUCCESS = Path.join(
  __dirname,
  '..',
  '..',
  '.log',
  'ansible_success.log'
);
const LOG_ERROR = Path.join(__dirname, '..', '..', '.log', 'ansible_error.log');
const VARS_FILE = Path.join(__dirname, '..', 'files', 'pabloTFG.yaml');

/* Type checkers */
const isCreateVMInterfaceArray = (obj: unknown): obj is CreateVMInterface[] =>
  Array.isArray(obj) && obj.every(isCreateVMInterface);

const isCreateVMInterface = (obj: unknown): obj is CreateVMInterface => {
  const keys = Object.keys(obj as CreateVMInterface);
  return obj != null && keys.includes('name') && keys.includes('cluster')
    && keys.includes('distro') && keys.includes('prefix') && keys.includes('ip')
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
    console.log(`Data saved on: ${VARS_FILE}\n`);
  });
};

export const execAnsiblePlaybook = (playbookFile: string, inventory?: string): number => {
  const playbook = new Playbook().playbook(playbookFile);
  if (!!inventory) {
    playbook.inventory(inventory);
  }
  playbook.on('stdout', (data) => {
    console.log(data.toString());
  });
  playbook.on('stderr', (data) => {
    console.log(data.toString());
  });
  const promise = playbook.exec();

  let resultCode;
  promise.then(
    (successResult) => {
      // Successful log file
      console.log(
        `Success on playbook execution with exit code: ${successResult.code}`
      );

      /*
      const date = new Date();
      fs.appendFile(
        LOG_SUCCESS,
        `${date}\n${successResult.output}\n`,
        (errorFile: ErrnoException | null) => {
          if (errorFile) {
            throw errorFile;
          }

          console.log(`Successful log on:  ${LOG_SUCCESS}\n`);
        }
      );
       */

      resultCode = successResult.code;
    },
    (error) => {
      // Failed log archive
      const date = new Date();
      console.log('\n\t Error: \n', error);

      /*
      fs.appendFile(
        LOG_ERROR,
        `${date}\n${error}\n`,
        (errorFile: ErrnoException | null) => {
          if (errorFile) {
            throw errorFile;
          }

          console.log(`Failed log on: ${LOG_ERROR}\n`);
        }
      );
       */

      resultCode = 1;
    }
  );
  return resultCode;
};

export const parseInventory = (inventoryPath: string) => {
  const data = fs.readFileSync(inventoryPath, { encoding: 'utf8' });
  console.log({ data });
};
