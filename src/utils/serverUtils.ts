// Temporal
import fs from 'fs';
import { PythonShell, PythonShellError } from 'python-shell';

import ErrnoException = NodeJS.ErrnoException;

export const getHelloMessage = () => 'Hello';

interface varsObject {
  action: string;
  username?: string;
  password?: string;
}

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
