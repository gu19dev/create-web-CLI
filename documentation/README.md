---
# doc as a code
 [para ler em português clique aqui](MELEIA.md)
Welcome to the documentation! This set will provide you with a detailed overview of how to use and understand each part of the CLI for structuring frontend projects. Here's an overview of what the documentations for each file will look like:
##

1. bin.mjs
This file is responsible for controlling the command-line interface (CLI) of the project. Here, users interact with the CLI to create new projects.

2. index.js
The index.js is the main file of the project. It contains the core logic for creating a new project based on the options provided by the user.

3. animation.mjs
The animation.mjs is responsible for displaying an attractive animation when the CLI is started. It adds a stylish touch to the user experience.

## How to Use This Documentation
Each document will be divided into sections that explain the file's function, its internal logic, and how it fits into the overall context of the project. Additionally, we'll provide examples and clear explanations to ensure you fully understand each part of our CLI.

---

## System Logic
This project is a command-line interface (CLI) tool for creating new websites or web applications. It guides users through a series of interactive steps, where they can select their preferred language, desired project template, and provide a name for the new project. Based on these inputs, the system creates a new directory and copies the files from the chosen template into it. The goal is to simplify and automate the process of bootstrapping new web projects, offering a friendly and intuitive experience through a command-line interface.

---

## index.js

This is the main file of your project. It exports a function that creates a new project based on a template.

### Importing Dependencies

The script starts by importing the necessary dependencies:

```javascript
let fs = require("fs");
const { resolve } = require("path");
const { red, green, cyan, bgRed, bgGreen, bgCyan } = require("chalk");
```


fs: Node.js built-in module for file system operations.
path: Node.js built-in module for handling and transforming file paths.
chalk: Used for styling the console output.

## Main Function


The main function exported by this module is create(options). This function takes an options object as a parameter, which should contain the following properties:

name: The name of the new project.
template: The template to use for the new project.
The function then determines the source and destination paths for the project files:

```JavaScript

const model = template || 'vanilla-frontend';
const src = resolve(__dirname, "__templates", model);
const dist = resolve(process.cwd(), name);
```
The function checks if the destination directory already exists. If it does, the function logs an error message and exits:


```Javascript

if (fs.existsSync(dist)) {
  console.log(red(`The target directory exists.\n${dist}`));
  return process.exit(1);
}

```

The function then calls copyDirRecursive(src, dist) to copy the template files to the new project directory. After the files have been copied, the function logs the new project structure to the console with tree(dist, true).

The function ends by calling ``updateHTMLTitles(dist, name)`` to update the title tags in any HTML files in the new project.

### Helper Functions
The ``copyDirRecursive(src, dest), tree(path, isRoot, prefix)``, ``updateHTMLTitles(dist, projectName)``, and ``getHTMLFiles(dir)`` functions are helper functions used by the main ``create(options)`` function.

Each of these functions has a specific role in creating the new project, from copying files and directories, to logging the project structure, to updating HTML titles.

```javascript
function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest);
  fs.readdirSync(src).forEach(file => {
    const srcPath = resolve(src, file);
    const destPath = resolve(dest, file);
    const isDirectory = fs.statSync(srcPath).isDirectory();
    if (isDirectory) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
```
##### tree(path, isRoot=false, prefix=")
This function is used to log the structure of the new project to the console. It does this recursively, meaning it will also log all subdirectories and their contents.

```JavaScript

function tree(path, isRoot=false, prefix='') {
  const files = fs.readdirSync(path);
  if (isRoot) {
    console.log(red('~\\' + path.split('\\').pop()));
  }
  files.forEach((name, i, { length }) => {
    const isLast = i === length - 1;
    const fullPath = resolve(path, name);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      console.log(prefix + (isLast ? '└── ' : '├── ') + cyan(name + '/'));
      tree(fullPath, false, prefix + (isLast ? '    ' : '|   '));
    } else {
      console.log(prefix + (isLast ? '└── ' : '├── ') + green('.' + name));
    }
  });
```

#### updateHTMLTitles(dist, projectName)

This function is used to update the title tags in any HTML files in the new project. It does this by reading each HTML file, replacing the content between the `<title>` tags with the name of the project, and then writing the updated content back to the file.

```javascript
function updateHTMLTitles(dist, projectName) {
  const htmlFiles = getHTMLFiles(dist);
  htmlFiles.forEach(file => {
    const filePath = resolve(dist, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<title>(.*?)<\/title>/g, `<title>${projectName}</title>`);
    fs.writeFileSync(filePath, content, 'utf8');
  });
}
```

getHTMLFiles(dir)
This function is used to get a list of all HTML files in a directory. It does this by reading the directory and filtering out any files that do not have a .html extension.

```JavaScript

function getHTMLFiles(dir) {
  const files = fs.readdirSync(dir);
  const htmlFiles = files.filter(file => /\.html$/.test(file));
  return htmlFiles;
}
```


These helper functions work together to create a new project based on a template, copy the necessary files, log the project structure, and update the HTML titles. They make the `create(options)` function more modular and easier to understand




### create(options)

This is the main function exported by the module. It takes an `options` object as a parameter, which should contain the following properties:

- `name`: The name of the new project.
- `template`: The template to use for the new project.

The function then determines the source and destination paths for the project files:

```javascript
const model = template || 'vanilla-frontend';
const src = resolve(__dirname, "__templates", model);
const dist = resolve(process.cwd(), name);
```

The function checks if the destination directory already exists. If it does, the function logs an error message and exits:
```javascript
if (fs.existsSync(dist)) {
  console.log(red(`The target directory exists.\n${dist}`));
  return process.exit(1);
}

The function then calls copyDirRecursive(src, dist) to copy the template files to the new project directory. After the files have been copied, the function logs the new project structure to the console with tree(dist, true).
The function ends by calling updateHTMLTitles(dist, name) to update the title tags in any HTML files in the new project.

module.exports = function create(options) {
  const { name, template } = options;
  const model = template || 'vanilla-frontend';
  const src = resolve(__dirname, "__templates", model);
  const dist = resolve(process.cwd(), name);

  if (fs.existsSync(dist)) {
    console.log(red(`The target directory exists.\n${dist}`));
    return process.exit(1);
  }

  copyDirRecursive(src, dist);
  process.stdout.write('\u001B[2J\u001B[0;0f');
  console.log(`${dist} Generated.`);
  tree(dist, true);
  console.log('\n');
  console.log('Legenda: ' + '/' +' captions');
  console.log(bgRed('~\\') + " - " + translations[global.language].rootFolder + "\u200B");
  console.log(bgCyan('/') + " - " + translations[global.language].blueFolder + "\u200B");
  console.log(bgGreen('.') + " - " + translations[global.language].greenFile + "\u200B");
  updateHTMLTitles(dist, name);
};
```

This function is the core of your CLI tool. It uses the helper functions to create a new project based on the user's input, copy the necessary files, log the project structure, and update the HTML titles.




## bin.mjs

This is the binary file of your project. It is responsible for handling the command-line interface (CLI) of your application.

### Importing Dependencies

The script starts by importing the necessary dependencies:

```javascript
import inquirer from 'inquirer';
import create from './index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import startAnimation from './animation.mjs';
```
- inquirer: A collection of common interactive command-line user interfaces.
- create: The main function exported by the index.js file.
- fileURLToPath: A Node.js utility function for converting a URL into a path.
- dirname and join: Node.js built-in functions for handling and transforming file paths.
- startAnimation: A function that handles the animation at the start of the CLI.
Main FunctionThe main function of this file is startCLI(). This function is responsible for starting the CLI, displaying the animation, and asking the user for the language preference.

```javascript
async function startCLI() {
    await startAnimation();
    process.stdout.write('\u001B[2J\u001B[0;0f');
    showLanguageQuestion();
}
```
The startCLI() function first calls startAnimation() to display the animation. After the animation is finished, it clears the console and calls showLanguageQuestion() to ask the user for their language preference.

#### Helper Functions
The bin.mjs file contains several helper functions that are used by the main function. These include getCurrentDirname(importMetaUrl), showLanguageQuestion(), selectProjectModel(), and createProject().

Each of these functions has a specific role in the CLI, from getting the current directory name, to asking the user for their language preference, to selecting the project model, to creating the project.

For example, the createProject() function asks the user for the project name and then calls the create() function from index.js to create the project:

```javascript
function createProject() {
    const projectNameQuestion = {
        type: 'input',
        name: 'name',
        message: `${global.language === 'pt' ? 'Digite o nome do projeto:' : 'Enter project name:'}`,
        validate: function (input) {
            if (!input) {
                return `${global.language === 'pt' ? 'O nome do projeto é obrigatório.' : 'Project name is required.'}`;
            }
            return true;
        }
    };

    inquirer.prompt(projectNameQuestion).then(answer => {
        projectName = answer.name;
        const __dirname = getCurrentDirname(import.meta.url);
        const templatesDir = join(__dirname, '__templates');
        const src = join(templatesDir, selectedModel);

        create({
            name: projectName,
            template: src
        });
    });
}
```

This function is responsible for creating a new project based on the user's input. It uses the `inquirer` module to prompt the user for the project name, and then calls the `create()` function with the appropriate options.

#### getCurrentDirname(importMetaUrl)

This function is used to get the current directory name. It does this by converting the `import.meta.url` to a file path and then getting the directory name of that path.

```javascript
function getCurrentDirname(importMetaUrl) {
    const __filename = fileURLToPath(importMetaUrl);
    return dirname(__filename);
}
```
showLanguageQuestion()This function is used to display a question to the user asking for their preferred language. It uses the inquirer module to prompt the user and then sets the global language variable based on the user's response.
```javascript
function showLanguageQuestion() {
    const languageQuestion = {
        type: 'list',
        name: 'language',
        message: 'Escolha o idioma / Choose language:',
        choices: ['Português', 'English']
    };

    inquirer.prompt(languageQuestion).then(answer => {
        const language = answer.language === 'English' ? 'en' : 'pt';
        global.language = language;
        selectProjectModel();
    });
}
```
selectProjectModel()This function is used to display a question to the user asking for the project model they want to use. It uses the inquirer module to prompt the user and then sets the selectedModel variable based on the user's response.
```javascript
function selectProjectModel() {
    const modelQuestion = {
        type: 'list',
        name: 'model',
        message: `${global.language === 'pt' ? 'Escolha o modelo do projeto:' : 'Choose project model:'}`,
        choices: ['vanilla-frontend', 'template-react']
    };

    inquirer.prompt(modelQuestion).then(answer => {
        selectedModel = answer.model;
        process.stdout.write('\u001B[2J\u001B[0;0f');
        createProject();
    });
}
```

These functions work together to create an interactive command-line interface for your tool. They ask the user for their preferences and then use those preferences to create a new project.


### startCLI()

This is the main function that starts the CLI. It first displays an animation by calling `startAnimation()`. After the animation is finished, it clears the console and calls `showLanguageQuestion()` to ask the user for their language preference.

```javascript
async function startCLI() {
    await startAnimation();
    process.stdout.write('\u001B[2J\u001B[0;0f');
    showLanguageQuestion();
}
```
The startCLI() function is asynchronous because it waits for the startAnimation() function to finish before proceeding. The '\u001B[2J\u001B[0;0f' is an escape sequence that clears the console.
The startCLI() function is called at the end of the script to start the CLI:
```
startCLI();
```

This concludes the documentation for your `bin.mjs` file. Each function has been explained in detail, including its purpose, how it works, and how it interacts with other functions. 

#



## animation.mjs

This file is responsible for handling the animation that is displayed when the CLI is started.

### Importing Dependencies

The script starts by importing the necessary dependencies:

```javascript
import figlet from 'figlet';
import chalk from 'chalk';
import readline from 'readline';
```

- figlet: A program for making large letters out of ordinary text. It's used in this project to create ASCII art from text.
- chalk: Used for styling the console output.
- readline: Node.js built-in module for reading lines of input from a readable stream.
startAnimation FunctionThe startAnimation function is exported by this module. This function handles the animation that is displayed when the CLI is started.
```javascript
const startAnimation = () => {
    const fonts = ['ogre', 'standard', 'slant'];
    const colors = [chalk.red, chalk.yellow, chalk.green, chalk.blue, chalk.magenta, chalk.cyan];
    let currentIndex = 0;
    let animationRunning = true;

    function printAnimation() {
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        const font = fonts[Math.floor(currentIndex / colors.length) % fonts.length];
        const color = colors[currentIndex % colors.length];
        const figletText = figlet.textSync('Create-website-CLi', { font });
        const coloredText = color(figletText);
        console.log(coloredText);
    }

    function printSkipText() {
        const animationHeight = figlet.textSync('Create-website-CLi', { font: fonts[0] }).split('\n').length;
        readline.cursorTo(process.stdout, 0, animationHeight);
        console.log(`${chalk.white('Pressione Enter ou Espaço para pular a animação...')} / ${chalk.red('Pressing enter or space for skip animation')}`);
    }

    function clearSkipText() {
        const animationHeight = figlet.textSync('Create-website-CLi', { font: fonts[0] }).split('\n').length;
        readline.cursorTo(process.stdout, 0, animationHeight);
        readline.clearLine(process.stdout, 0);
    }

    const totalFrames = fonts.length * colors.length;

    process.stdout.write('\x1B[?25l');

    printAnimation();
    printSkipText();

    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            if (animationRunning) {
                currentIndex++;
                if (currentIndex < totalFrames) {
                    printAnimation();
                    printSkipText();
                } else {
                    animationRunning = false;
                    clearInterval(intervalId);
                    process.stdout.write('\x1B[?25h');
                    clearSkipText();
                    resolve();
                }
            }
        }, 500);

        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        process.stdin.on('keypress', (_, key) => {
            if (key && (key.name === 'return' || key.name === 'space')) {
                animationRunning = false;
                clearInterval(intervalId);
                process.stdout.write('\x1B[?25h');
                clearSkipText();
                resolve();
            }
        });

        intervalId.unref();
    });
};

export default startAnimation;
```

The startAnimation function starts by defining several variables and functions that are used to control the animation. 
It then starts the animation by calling printAnimation() and printSkipText(). The animation continues until all frames have been displayed or the user presses Enter or Space.

The startAnimation function is asynchronous because it waits for the startAnimation() function to finish before proceeding. T
he '\u001B[?25l' is an escape sequence that hides the cursor.

The startAnimation() function is called at the end of the script to start the CLI:
```
startCLI();
```

This concludes the documentation for your `animation.mjs` file. Each function has been explained in detail, including its purpose, how it works, and how it interacts with other functions. 

