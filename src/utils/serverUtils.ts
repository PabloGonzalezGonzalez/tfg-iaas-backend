import { Playbook } from 'node-ansible';
import { stringify as jsonToYaml } from 'json-to-pretty-yaml';

import fs from 'fs';
import Path from 'path';

import ErrnoException = NodeJS.ErrnoException;

/* Interfaces */
interface varsObject {
  action: string;
  username?: string;
  password?: string;
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
export const createVarsFile = (vars: varsObject) => {
  fs.writeFile(varsFile, jsonToYaml(vars), (error: ErrnoException | null) => {
    if (error) {
      throw error;
    }
    console.log(`Data saved on: ${varsFile}\n`);
  });
};

export const execAnsiblePlaybook = (playbookFile) => {
  const playbook = new Playbook().playbook(playbookFile);
  playbook.on('stdout', (data) => {
    console.log(data.toString());
  });
  playbook.on('stderr', (data) => {
    console.log(data.toString());
  });
  const promise = playbook.exec();

  promise.then(
    (successResult) => {
      // Successful log file
      console.log(
        `Successful playbook execution with exit code: ${successResult.code}`
      );

      const date = new Date();
      console.log(LOG_SUCCESS);
      console.log(successResult.output);

      fs.appendFile(
        LOG_SUCCESS,
        `${date}\n${successResult.output}`,
        (errorFile: ErrnoException | null) => {
          if (errorFile) {
            throw errorFile;
          }

          console.log(`Successful log on:  ${LOG_SUCCESS}\n`);
        }
      );
    },
    (error) => {
      // Failed log archive
      const date = new Date();

      fs.appendFile(
        LOG_ERROR,
        `${date}\n${error}`,
        (errorFile: ErrnoException | null) => {
          if (errorFile) {
            throw errorFile;
          }

          console.log(`Failed log on: ${LOG_ERROR}\n`);
        }
      );
    }
  );
};
