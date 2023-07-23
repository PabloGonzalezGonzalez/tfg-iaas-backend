// const MOCKUP = `
// ; <<>> DiG 9.16.1-Ubuntu <<>> @10.6.131.86 -t axfr alu0100887037.ull.lan
// ; (1 server found)
// ;; global options: +cmd
// alu0100887037.ull.lan.\t86400\tIN\tSOA\tns1.alu0100887037.ull.lan. admin.alu0100887037.ull.lan. 2023070301 10800 3600 604800 86400
// alu0100887037.ull.lan.\t86400\tIN\tNS\tns1.alu0100887037.ull.lan.
// ns1.alu0100887037.ull.lan. 86400 IN\tA\t10.6.130.22
// alu0100887037.ull.lan.\t86400\tIN\tSOA\tns1.alu0100887037.ull.lan. admin.alu0100887037.ull.lan. 2023070301 10800 3600 604800 86400
// ;; Query time: 3 msec
// ;; SERVER: 10.6.131.86#53(10.6.131.86)
// ;; WHEN: Sun Jul 09 20:22:37 UTC 2023
// ;; XFR size: 4 records (messages 1, bytes 190)
// `;

const fs = require('fs/promises');

/****
 * Steps:
 *   1. Split the output in single lines
 *   2. Remove the lines that are not relevant records
 *   3. Split the lines in substrings for spaces and tabs
 *   4. Filter the substrings to get the desired result: ['name', 'IP']
 *   5. Filter the substrings to remove the non-records ones
 *   6. Get username from name
 *   7. Create the ansible inventory with the correct format:    [name]
 *                                                               ip
 ****/

const parseFromDigOutputToAnsibleInventoryOld = async (textToParse) => {
  // Step 1
  const lines = textToParse.toString().split('\n');
  // Step 2
  const relevantLines = lines.filter(line => line && !line.includes(';'));
  // Step 3
  const substringsFromLines = relevantLines.map(line => {
    const listOfLines = [];
    const newLineArrayWithoutTab = line.split('\t');
    const newLineArrayWithoutSpace = newLineArrayWithoutTab.map(newLine => newLine.split(' '));
    newLineArrayWithoutSpace.forEach(lineArray => lineArray.forEach(newLine => listOfLines.push(newLine)));
    return listOfLines;
  });

  // Step 4
  const relevantSubstrings = substringsFromLines.map(substrings => ([substrings[0].slice(0, -1), substrings[4]]));

  // Step 5
  const regExpForLetters = /[a-zA-Z]/g;
  const regExpForName = /\w*\.\w*\.[a-z]*\.[a-z]*.?/;
  const recordsSubstrings = relevantSubstrings.filter(substrings => regExpForName.test(substrings[0]) && !regExpForLetters.test(substrings[1]));

  // Step 6
  const username = recordsSubstrings[0][0].split('.')[1];

  // Step 7
  const ansibleInventory = recordsSubstrings.map(substrings => (`[${substrings[0]}]\n${substrings[1]}\n\n`));

  fs.writeFile(`./ansible/inventory/hosts-${username}`, ansibleInventory)
    .catch((err) => console.error(err));
};

// execution
const args = process.argv;
const fileToRead = args[2];

fs.readFile(fileToRead, { encoding: 'utf-8' })
  .then((res) => parseInventory(res))
  .catch((err) => console.error(err));

const parseInventory = (textToParse) =>
  parseFromDigOutputToAnsibleInventoryOld(textToParse)
    .catch((err) => console.error(err));
