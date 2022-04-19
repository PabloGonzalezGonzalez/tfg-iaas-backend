import { Playbook } from 'node-ansible';
import { stringify as jsonToYaml } from 'json-to-pretty-yaml';

import fs from 'fs';
import Path from 'path';
import ErrnoException = NodeJS.ErrnoException;

/* Interfaces */
export interface createVMInterface {
  name: string;
  cluster: string;
  distro: string;
}

export type nodesType =
  | string
  | string[]
  | createVMInterface
  | createVMInterface[];

export type actionType = 'start' | 'stop' | 'restart';

interface varsInterface {
  action?: actionType;
  nodes?: nodesType;
  vmName?: string; // deprecated
  username?: string;
  password?: string;
  prefix?: string;
  vmUsername?: string;
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

/* Functions */
export const createVarsFile = (vars: varsInterface) => {
  fs.writeFile(varsFile, jsonToYaml(vars), (error: ErrnoException | null) => {
    if (error) {
      throw error;
    }
    console.log(`Data saved on: ${varsFile}\n`);
  });
};

export const execAnsiblePlaybook = (playbookFile) => {
  const playbook = new Playbook().playbook(playbookFile);
  // playbook.on('stdout', (data) => {
  //   console.log(data.toString());
  // });
  // playbook.on('stderr', (data) => {
  //   console.log(data.toString());
  // });
  const promise = playbook.exec();

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

      return successResult.code;
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

      return new Error('Error on playbook execution');
    }
  );
};
