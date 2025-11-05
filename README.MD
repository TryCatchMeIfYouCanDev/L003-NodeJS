# LESSON ONE - Node.js File System and Process Notes #

## 1. Introduction ##

This document summarises and explains how to use Node.js modules for interacting with the file system (`fs`), managing paths (`path`), handling processes (`process`), and utilising some external libraries such as `chalk` and `luxon`.  
It combines key concepts, notes, and working code examples for practical and didactic purposes.

---

## 2. Core Node.js Modules ##

### 2.1 The `fs` (File System) Module ###

The **File System (`fs`) module** allows Node.js to interact with files and directories.  
It can **read, write, modify, rename, and delete** both files and folders.  
The module provides both **synchronous** and **asynchronous** versions of most methods.

| Operation        | Asynchronous      | Synchronous           | Description                               |
| ---------------- | ----------------- | --------------------- | ----------------------------------------- |
| Read file        | `fs.readFile()`   | `fs.readFileSync()`   | Reads the content of a file               |
| Write file       | `fs.writeFile()`  | `fs.writeFileSync()`  | Creates or overwrites a file              |
| Append to file   | `fs.appendFile()` | `fs.appendFileSync()` | Adds content at the end of a file         |
| Delete file      | `fs.unlink()`     | `fs.unlinkSync()`     | Removes a file                            |
| Create directory | `fs.mkdir()`      | `fs.mkdirSync()`      | Creates a new folder                      |
| Remove directory | `fs.rm()`         | `fs.rmSync()`         | Removes a directory (even non-empty ones) |
| Read directory   | `fs.readdir()`    | `fs.readdirSync()`    | Reads directory content                   |
| Rename / Move    | `fs.rename()`     | `fs.renameSync()`     | Renames or moves files/directories        |

>  **Note:** Synchronous methods block the event loop. They are suitable only for simple scripts or startup tasks.

---

### 2.2 The `process` Module ###

The **`process` module** is a global Node.js object that provides information about and control over the running Node.js process.

#### Key method: `process.cwd()` ####
- Returns the **current working directory** of the process — the folder from which Node.js was launched.
- Example:

```js
console.log(process.cwd());
```

If you execute your script from `/Users/yourname/projects`, even if the file is located in a subfolder, it will return `/Users/yourname/projects`.

This is crucial when building relative paths dynamically in scripts.

---

### 2.3 The `path` Module ###

The **`path` module** provides utilities for working with file and directory paths across operating systems.

Example usage:
```js
import path from "node:path";

const folderPath = path.join(process.cwd(), "data");
const filePath = path.join(folderPath, "file.txt");
```

| Function          | Description                                        |
| ----------------- | -------------------------------------------------- |
| `path.join()`     | Joins path segments using the correct OS separator |
| `path.basename()` | Returns the last portion of a path                 |
| `path.dirname()`  | Returns the parent directory of a path             |
| `path.extname()`  | Returns the extension of a file                    |
| `path.resolve()`  | Returns an absolute path                           |

---

## 3. External Libraries ##

### 3.1 `chalk` ###
Used to **colour terminal output**, making logs more readable.  
Example:
```js
import chalk from "chalk";
console.log(chalk.green("Success!"));
console.log(chalk.red("Error!"));
```

> With TypeScript, use **chalk version 4** for compatibility.

Install:
```bash
npm install chalk@4
```

---

### 3.2 `luxon` ###
`luxon` is a library for managing and formatting **dates and times**. It is the modern successor to Moment.js.

Example:
```js
import { DateTime } from "luxon";

let creationDate = DateTime.fromMillis(Date.now());
console.log(creationDate.toFormat("DDDD dd MMMM yyyy HH:mm"));
console.log(creationDate.toRelative()); // Example: "3 minutes ago"
```

If you use TypeScript, you must also install its types:
```bash
npm i --save-dev @types/luxon
```

---

## 4. Practical Example — `es-fs.ts` ##

Below is a simplified, and annotated version of the code integrating all key concepts.

```ts
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import chalk from "chalk";
import { DateTime } from "luxon";

export default () => {
  const workDir = process.cwd(); // Current Working Directory
  const dataFullDir = path.join(workDir, "data");
  const filePath = path.join(dataFullDir, "file.txt");

  /* Reading Files */
  try {
    const text = fs.readFileSync(filePath, "utf-8");
    console.log(text);
  } catch {
    console.log(chalk.red("An error occurred while reading the file."));
  }

  /* Writing Files */
  try {
    const content = `It's **${new Date().toLocaleTimeString()}**`;
    fs.writeFileSync(path.join(dataFullDir, "timetable.md"), content, "utf-8");
    console.log("File written successfully.");
  } catch {
    console.log(chalk.red("An error occurred while writing the file."));
  }

  /* Reading Directory */
  try {
    const entities = fs.readdirSync(workDir, { withFileTypes: true });
    console.log(`Directory content of ${chalk.green(workDir)}:`);
    for (const entity of entities) {
      console.log(entity.isDirectory() ? "[Dir]" : "[File]", chalk.yellow(entity.name));
    }

    const names = fs.readdirSync(workDir);
    for (const name of names) {
      const stat = fs.statSync(path.join(workDir, name));
      const creationDate = DateTime.fromMillis(stat.ctimeMs);
      const dateString = creationDate.setLocale("en").toRelative();
      console.log(stat.isDirectory() ? "[Dir]" : "[File]", chalk.green(name), stat.size, chalk.blue(dateString));
    }
  } catch (error) {
    console.log(chalk.red("An error occurred while reading directories."));
  }

  /* Creating, Removing, and Moving Directories */
  const octPath = path.join(dataFullDir, "spreadsheets-october");
  const novPath = path.join(dataFullDir, "spreadsheets-november");

  try {
    fs.mkdirSync(octPath);
    fs.mkdirSync(novPath);
    fs.writeFileSync(path.join(novPath, "testFile.md"), "Sample content", "utf-8");
    console.log("Directories created successfully.");
  } catch (error) {
    console.log(chalk.red("An error occurred while creating directories."));
  }

  try {
    fs.rmSync(octPath, { recursive: true, force: true });
    fs.rmSync(novPath, { recursive: true, force: true });
    console.log("Directories deleted successfully.");
  } catch (error) {
    console.log(chalk.red("An error occurred while deleting directories."));
  }
};
```

---

## 5. Error Handling ##

To safely handle file operations that might fail, always use `try...catch`.  
Optionally, add `finally` for cleanup or messages that must always run.

Example:
```js
try {
  const text = fs.readFileSync("data/file.txt", "utf-8");
  console.log(text);
} catch (error) {
  console.log("An error occurred:", error.message);
} finally {
  console.log("Operation completed.");
}
```

---

## 6. Summary Table — Common `fs` Operations ##

| Action          | Method                                              | Description                       |
| --------------- | --------------------------------------------------- | --------------------------------- |
| Read a file     | `fs.readFileSync(path, "utf-8")`                    | Reads content from a file         |
| Write a file    | `fs.writeFileSync(path, data, "utf-8")`             | Creates or overwrites a file      |
| Append text     | `fs.appendFileSync(path, data)`                     | Adds data to an existing file     |
| Delete a file   | `fs.unlinkSync(path)`                               | Removes a file                    |
| Create a folder | `fs.mkdirSync(path)`                                | Creates a directory               |
| Delete a folder | `fs.rmSync(path, { recursive: true, force: true })` | Removes a folder (and contents)   |
| Rename or move  | `fs.renameSync(oldPath, newPath)`                   | Renames or moves a folder or file |
| Read directory  | `fs.readdirSync(path)`                              | Lists directory contents          |

---

## 7. Useful Links ##

- https://www.npmjs.com/package/chalk
- https://www.npmjs.com/package/luxon

---

## 8. Console Commands ##

1. `npm start` // Starts the Node.js application  
2. `npm run build` // Builds the TypeScript project  
3. `node app.js` // Runs the compiled JavaScript  
4. `npm install chalk@4` // Installs chalk version 4  
5. `npm i luxon` // Installs the Luxon library  
6. `npm i --save-dev @types/luxon` // Installs Luxon TypeScript types  

---

*End of Class Notes Summary*