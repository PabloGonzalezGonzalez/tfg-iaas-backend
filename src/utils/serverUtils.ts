import fs from 'fs';
import { PythonShell, PythonShellError } from 'python-shell';
import Ansible from 'node-ansible';
import ErrnoException = NodeJS.ErrnoException;
import Path from 'path';

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

/* Functions */
export const createVarsFile = (
  varsFile: string,
  scriptFile: string,
  vars: varsObject
) => {
  console.log({ varsFile, scriptFile, vars });
  fs.writeFile(
    varsFile,
    JSON.stringify(vars),
    (error: ErrnoException | null) => {
      if (error) {
        throw error;
      }
      console.log(`Data saved on: ${varsFile}\n`);
    }
  );

  const pyScript = new PythonShell(scriptFile);
  pyScript.end((error: PythonShellError) => {
    if (error) {
      throw error;
    }
    console.log('Python script ended');
  });
};

export const execPlaybook = (playbookFile) => {
  const playbook = new Ansible.Playbook().playbook(playbookFile);
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
