//import path from 'path';
import fs from 'fs/promises';

async function readConfigFile() {
  try {
    const data = await fs.readFile('../../src/config/fabric-config.json', 'utf-8');
    console.log(data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

readConfigFile();
