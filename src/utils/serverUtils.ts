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

export type NodesType =
  | string
  | string[]
  | CreateVMInterface
  | CreateVMInterface[];

export type ActionType = 'start' | 'stop' | 'restart';

interface VarsInterface {
  action?: ActionType;
  nodes?: NodesType;
  vmName?: string; // deprecated
  username?: string;
  password?: string;
  prefix?: string;
  vmUsername?: string;
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

const varsFile = Path.join(__dirname, '..', 'files', 'pabloTFG.yaml');

const isCreateVMInterfaceArray = (obj: any): obj is CreateVMInterface[] =>
  (obj as any)?.map((node) => isCreateVMInterface(node));

const isCreateVMInterface = (obj: any): obj is CreateVMInterface =>
  (obj as any).name === 'string' && (obj as any).distro === 'string' && (obj as any).cluster === 'string' && (obj as any).prefix === 'string';

/* Functions */
export const createVarsFile = (vars: VarsInterface): void => {
  if (vars.nodes) {
    if (isCreateVMInterfaceArray(vars.nodes)) {
      vars.nodes.map((node) => node['fullName'] = node.prefix
        ? `${node.prefix}-${node.name}`
        : node.name);
    }
  }
  fs.writeFile(varsFile, jsonToYaml(vars), (error: ErrnoException | null) => {
    if (error) {
      throw error;
    }
    console.log(`Data saved on: ${varsFile}\n`);
  });
};

export const execAnsiblePlaybook = (playbookFile: string): number => {
  const playbook = new Playbook().playbook(playbookFile);
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

      resultCode = successResult.code;
    },
    (error) => {
      // Failed log archive
      const date = new Date();
      console.log('\n\t Error: \n', error);

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

      resultCode = 1;
    }
  );
  return resultCode;
};
