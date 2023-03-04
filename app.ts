const foldersToIgnore = ["node_modules", ".git"];
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
const argv = require('minimist')(process.argv.slice(2));
const save = argv.save;

/**
* @param {string} path - path of directory
* @return {Array<Array<string>>} - a multidimensional array contains [ [fileName, FileType], ...]
*/
function readDirectory(path): Array<[string, string]> {
  const files = fs.readdirSync(path);
  const result: Array<[string, string]> = [];
  for (const file of files) {
    const stat = fs.statSync(`${path}\\${file}`);
    if (stat.isFile()) {
      result.push([file, 'file']);
    } else if (stat.isDirectory()) {
      result.push([file, 'directory']);
    }
  }
  return result;
}


/**
* @param {string} fileName - name of file
* @param {number} fileDeep - how much deep the file/folder
* @param {string} fileType - type of file
* @return {string} - generated line with icon and name of file/folder
*/
async function drawLine(fileName: string, fileDeep: number, fileType: string) {
  let start: string;
  let space: string = "    ".repeat(fileDeep);
  let line: string;

  if (space === "") line = "—";
  else line = "—";

  if (fileType === "file") start = "📄";
  else if (fileType === "directory") start = "📂";
  else start = "|";

  return `${space + start + line + fileName}\n`;
}

/**
* @param {string} fileName - name of file
* @param {string} fileType - type of file
* @param {number} fileDeep - how much deep the file/folder
* @param {string} path - path of file
* @param {string} DirectoryHierarchy - a recursed result from a recursion function buildDirectoryTree
* @return {string} - generated a tree directory
*/
async function buildDirectoryTree(fileName: string, fileType: string, fileDeep: number, path: string, DirectoryHierarchy: string) {
  if (fileType === "file") {
    DirectoryHierarchy += await drawLine(fileName, fileDeep, fileType);
  }
  else if (fileType == "directory") {
    if (foldersToIgnore.includes(fileName)) {
      return DirectoryHierarchy;
    }
    let currentPath = `${path}\\${fileName}`;
    let currentDirectory = await readDirectory(currentPath);
    DirectoryHierarchy += await drawLine(fileName, fileDeep, fileType);
    for (let file of currentDirectory) {
      let [fileName, fileType] = file;
      DirectoryHierarchy = await buildDirectoryTree(fileName, fileType, fileDeep + 1, currentPath, DirectoryHierarchy);
    }
  }
  return DirectoryHierarchy;
}

// main
(async () => {
  let path = __dirname;
  const fileDirectories: string[][] = await readDirectory(path);
  let DirectoryHierarchy: string = "";
  let fileDeep = 0;
  for (let file of fileDirectories) {
    let [fileName, fileType] = file;
    DirectoryHierarchy = await buildDirectoryTree(fileName, fileType, fileDeep, path, DirectoryHierarchy);
  }
  let fileName = "directoryTree";
  if (save === 'txt') {
    try {
      await fsPromises.writeFile(join(__dirname, fileName + ".txt"), DirectoryHierarchy);
    } catch (err) {
      console.error(err);
    }
  } else if (save === 'img') {
    console.log(save);
  }

})()