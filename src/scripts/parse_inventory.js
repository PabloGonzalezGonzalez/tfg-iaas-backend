// const MOCKUP = `
// ; <<>> DiG 9.16.1-Ubuntu <<>> @10.6.129.177 axfr midominio.local
// ; (1 server found)
// ;; global options: +cmd
// midominio.local.	604800	IN	SOA	midominio.local. root.midominio.local. 2022071307 604800 86400 2419200 604800
// midominio.local.	604800	IN	NS	ubuntu.midominio.local.
// midominio.local.	86400	IN	A	10.6.131.175
// ns5.midominio.local.	600	IN	A	10.6.131.86
// pc01.midominio.local.	604800	IN	A	192.168.10.21
// pc02.midominio.local.	604800	IN	A	192.168.10.22
// pc03.midominio.local.	86400	IN	A	10.6.131.175
// pc06.midominio.local.	600	IN	A	10.6.129.87
// ubuntu.midominio.local.	604800	IN	A	10.6.131.86
// midominio.local.	604800	IN	SOA	midominio.local. root.midominio.local. 2022071307 604800 86400 2419200 604800
// ;; Query time: 0 msec
// ;; SERVER: 10.6.129.177#53(10.6.129.177)
// ;; WHEN: Sun Feb 05 18:12:26 UTC 2023
// ;; XFR size: 10 records (messages 1, bytes 306)
// `;

const fs = require('fs/promises');

/****
 * Steps:
 *   1. Split the output in single lines
 *   2. Remove the lines that are not relevant records
 *   3. Split the lines in substrings
 *   4. Filter the substrigns to get the desired result: ['name', 'IP']
 *   5. Filter the substrings to remove the non-records ones
 *   6. Create the ansible inventory with the correct format:    [name]
 *                                                               ip
 ****/

const parseFromDigOutputToAnsibleInventory = async (textToParse) => {
  // Step 1
  const lines = textToParse.split('\n');
  // Step 2
  const relevantLines = lines.filter(line => line && !line.includes(';'));
  // Step 3
  const substringsFromLines = relevantLines.map(line => line.split('\t'));
  // Step 4
  const relevantSubstrings = substringsFromLines.map(substrings => ([substrings[0].slice(0, -1), substrings[4]]));
  // Step 5
  const regExpForLetters = /[a-zA-Z]/g;
  const recordsSubstrings = relevantSubstrings.filter(substrings => !substrings[1].includes(' ') && !regExpForLetters.test(substrings[1]));
  // Step 6
  const ansibleInventory = recordsSubstrings.map(substrings => (`[${substrings[0]}]\n${substrings[1]}\n\n`));

  try {
    await fs.writeFile('../ansible/inventory/hosts', ansibleInventory);
  } catch (err) {
    console.error(err);
  }
};

// execution
const args = process.argv;
const fileToRead = args[2];

try {
  const textToParse = fs.readFile(fileToRead, { encoding: 'utf-8' });
  await parseFromDigOutputToAnsibleInventory(textToParse);
} catch (err) {
  console.error(err);
}
