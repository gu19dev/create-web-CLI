----
# Documentando o código fonte

Bem-vindo à documentação! Este conjunto te fornecerá uma visão detalhada de como usar e entender cada parte do CLI para estruturação de projetos frontend. Aqui está uma visão geral de como serão as documentações para cada arquivo:

1. bin.mjs
Este arquivo é responsável pelo controle da interface de linha de comando (CLI) do projeto. Aqui, os usuários interagem com o CLI para criar novos projetos.

2. index.js
O index.js é o arquivo principal do projeto. Ele contém a lógica principal para criar um novo projeto com base nas opções fornecidas pelo usuário.

3. animation.mjs
O animation.mjs é responsável por exibir uma animação atraente quando o CLI é iniciado. Ele adiciona um toque de estilo à experiência do usuário.


 [english version](readme.md)
##

### Como Usar Esta Documentação
Cada documento será dividido em seções que explicam a função do arquivo, sua lógica interna e como ele se encaixa no contexto geral do projeto. Além disso, forneceremos exemplos e explicações claras para garantir que você compreenda completamente cada parte do nosso CLI.

---

## Lógica do sistema
Este projeto é uma ferramenta de linha de comando (CLI) para criar novos projetos de sites ou aplicativos da web. Ele guia os usuários através de uma série de etapas interativas, onde podem selecionar o idioma preferido, o modelo de projeto desejado e fornecer um nome para o novo projeto. Com base nessas entradas, o sistema cria um novo diretório e copia os arquivos do modelo escolhido para dentro dele. O objetivo é simplificar e automatizar o processo de inicialização de novos projetos da web, oferecendo uma experiência amigável e intuitiva por meio de uma interface de linha de comando.

---

## index.js

Este é o arquivo principal do seu projeto. Ele exporta uma função que cria um novo projeto com base em um modelo.

### Importando Dependências

O script começa importando as dependências necessárias:

```javascript
let fs = require("fs");
const { resolve } = require("path");
const { red, green, cyan, bgRed, bgGreen, bgCyan } = require("chalk");
```

fs: Módulo integrado do Node.js para operações no sistema de arquivos.
path: Módulo integrado do Node.js para manipular e transformar caminhos de arquivo.
chalk: Usado para estilizar a saída do console.

## Função Principal

A função principal exportada por este módulo é create(options). Esta função recebe um objeto de opções como parâmetro, que deve conter as seguintes propriedades:

name: O nome do novo projeto.
template: O modelo a ser usado para o novo projeto.
A função então determina os caminhos de origem e destino para os arquivos do projeto:

```JavaScript

const model = template || 'vanilla-frontend';
const src = resolve(__dirname, "__templates", model);
const dist = resolve(process.cwd(), name);
```

A função verifica se o diretório de destino já existe. Se existir, a função registra uma mensagem de erro e sai:

```Javascript

if (fs.existsSync(dist)) {
  console.log(red(`O diretório de destino já existe.\n${dist}`));
  return process.exit(1);
}

```

A função então chama copyDirRecursive(src, dist) para copiar os arquivos do modelo para o diretório do novo projeto. Após a cópia dos arquivos, a função registra a estrutura do novo projeto no console com tree(dist, true).

A função termina chamando updateHTMLTitles(dist, name) para atualizar as tags de título em quaisquer arquivos HTML no novo projeto.

### Funções Auxiliares
As funções copyDirRecursive(src, dest), tree(path, isRoot, prefix), updateHTMLTitles(dist, projectName) e getHTMLFiles(dir) são funções auxiliares usadas pela função principal create(options).

Cada uma dessas funções tem um papel específico na criação do novo projeto, desde copiar arquivos e diretórios até registrar a estrutura do projeto, até atualizar os títulos HTML.

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

##### tree(path, isRoot=false, prefix='')
Esta função é usada para registrar a estrutura do novo projeto no console. Ela faz isso de forma recursiva, ou seja, também registrará todos os subdiretórios e seus conteúdos.

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

Esta função é usada para atualizar as tags de título em quaisquer arquivos HTML no novo projeto. Ela faz isso lendo cada arquivo HTML, substituindo o conteúdo entre as tags `<title>` pelo nome do projeto e depois escrevendo o conteúdo atualizado de volta no arquivo.

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
Esta função é usada para obter uma lista de todos os arquivos HTML em um diretório. Ela faz isso lendo o diretório e filtrando quaisquer arquivos que não tenham a extensão .html.

```JavaScript

function getHTMLFiles(dir) {
  const files = fs.readdirSync(dir);
  const htmlFiles = files.filter(file => /\.html$/.test(file));
  return htmlFiles;
}
```

Essas funções auxiliares trabalham juntas para criar um novo projeto com base em um modelo, copiar os arquivos necessários, registrar a estrutura do projeto e atualizar os títulos HTML. Elas tornam a função `create(options)` mais modular e mais fácil de entender.

### create(options)

Esta é a função principal exportada pelo módulo. Ela recebe um objeto de `options` como parâmetro, que deve conter as seguintes propriedades:

- `name`: O nome do novo projeto.
- `template`: O modelo a ser usado para o novo projeto.

A função então determina os caminhos de origem e destino para os arquivos do projeto:

```javascript
const model = template || 'vanilla-frontend';
const src = resolve(__dirname, "__templates", model);
const dist = resolve(process.cwd(), name);
```

A função verifica se o diretório de destino já existe. Se existir, a função registra uma mensagem de erro e sai:

```javascript
if (fs.existsSync(dist)) {
  console.log(red(`O diretório de destino já existe.\n${dist}`));
  return process.exit(1);
}
```

A função então chama copyDirRecursive(src, dist) para copiar os arquivos do modelo para o diretório do novo projeto. Após a cópia dos arquivos, a função registra a estrutura do novo projeto no console com tree(dist, true).

A função termina chamando updateHTMLTitles(dist, name) para atualizar as tags de título em quaisquer arquivos HTML no novo projeto.

```javascript
module.exports = function create(options) {
  const { name, template } = options;
  const model = template || 'vanilla-frontend';
  const src = resolve(__dirname, "__templates", model);
  const dist = resolve(process.cwd(), name);

  if (fs.existsSync(dist)) {
    console.log(red(`O diretório de destino já existe.\n${dist}`));
    return process.exit(

1);
  }

  copyDirRecursive(src, dist);
  process.stdout.write('\u001B[2J\u001B[0;0f');
  console.log(`${dist} Gerado.`);
  tree(dist, true);
  console.log('\n');
  console.log('Legenda: ' + '/' +' legendas');
  console.log(bgRed('~\\') + " - " + translations[global.language].rootFolder + "\u200B");
  console.log(bgCyan('/') + " - " + translations[global.language].blueFolder + "\u200B");
  console.log(bgGreen('.') + " - " + translations[global.language].greenFile + "\u200B");
  updateHTMLTitles(dist, name);
};
```

Esta função é o núcleo da sua ferramenta CLI. Ela usa as funções auxiliares para criar um novo projeto com base na entrada do usuário, copiar os arquivos necessários, registrar a estrutura do projeto e atualizar os títulos HTML.


#

---

## bin.mjs
Este é o arquivo binário do seu projeto. Ele é responsável por lidar com a interface de linha de comando (CLI) da sua aplicação.

### Importação de Dependências
O script começa importando as dependências necessárias:
```javascript
import inquirer from 'inquirer';
import create from './index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import startAnimation from './animation.mjs';
```
- inquirer: Uma coleção de interfaces de usuário interativas comuns para linha de comando.
- create: A função principal exportada pelo arquivo index.js.
- fileURLToPath: Uma função utilitária do Node.js para converter uma URL em um caminho.
- dirname e join: Funções internas do Node.js para lidar e transformar caminhos de arquivo.
- startAnimation: Uma função que lida com a animação no início da CLI.

### Função Principal
A função principal deste arquivo é startCLI(). Esta função é responsável por iniciar a CLI, exibir a animação e perguntar ao usuário sobre a preferência de idioma.
```javascript
async function startCLI() {
 await startAnimation();
 process.stdout.write('\u001B[2J\u001B[0;0f');
 showLanguageQuestion();
}
```
A função startCLI() primeiro chama startAnimation() para exibir a animação. Após o término da animação, ela limpa o console e chama showLanguageQuestion() para perguntar ao usuário sobre sua preferência de idioma.

### Funções Auxiliares
O arquivo bin.mjs contém várias funções auxiliares que são usadas pela função principal. Estas incluem getCurrentDirname(importMetaUrl), showLanguageQuestion(), selectProjectModel() e createProject().
Cada uma dessas funções tem um papel específico na CLI, desde obter o nome do diretório atual até perguntar ao usuário sobre sua preferência de idioma, selecionar o modelo do projeto e criar o projeto.
Por exemplo, a função createProject() pergunta ao usuário sobre o nome do projeto e depois chama a função create() de index.js para criar o projeto:
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
Esta função é responsável por criar um novo projeto com base na entrada do usuário. Ela usa o módulo `inquirer` para solicitar ao usuário o nome do projeto e depois chama a função `create()` com as opções apropriadas.

### getCurrentDirname(importMetaUrl)
Esta função é usada para obter o nome do diretório atual. Ela faz isso convertendo a `import.meta.url` para um caminho de arquivo e depois obtendo o nome do diretório desse caminho.
```javascript
function getCurrentDirname(importMetaUrl) {
 const __filename = fileURLToPath(importMetaUrl);
 return dirname(__filename);
}
```

### showLanguageQuestion()
Esta função é usada para exibir uma pergunta ao usuário sobre seu idioma preferido. Ela usa o módulo inquirer para solicitar ao usuário e depois define a variável de idioma global com base na resposta do usuário.
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

### selectProjectModel()
Esta função é usada para exibir uma pergunta ao usuário sobre o modelo de projeto que deseja usar. Ela usa o módulo inquirer para solicitar ao usuário e depois define a variável selectedModel com base na resposta do usuário.
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

Essas funções trabalham juntas para criar uma interface de linha de comando interativa para sua ferramenta. Elas perguntam ao usuário suas preferências e depois usam essas preferências para criar um novo projeto.

### startCLI()
Esta é a função principal que inicia a CLI. Ela primeiro exibe uma animação chamando `startAnimation()`. Após o término da animação, ela limpa o console e chama `showLanguageQuestion()` para perguntar ao usuário sobre sua preferência de idioma.
```javascript
async function startCLI() {
 await startAnimation();
 process.stdout.write('\u001B[2J\u001B[0;0f');
 showLanguageQuestion();
}
```
A função startCLI() é assíncrona porque aguarda o término da função `startAnimation()` antes de prosseguir. O '\u001B[2J\u001B[0;0f' é uma sequência de escape que limpa o console.
A função startCLI() é chamada no final do script para iniciar a CLI:
```
startCLI();
```

Isso conclui a documentação para o seu arquivo `bin.mjs`. Cada função foi explicada detalhadamente, incluindo sua finalidade, como ela funciona e como interage com outras funções.

---


## animation.mjs

Este arquivo é responsável por lidar com a animação que é exibida quando a CLI é iniciada.

### Importando Dependências

O script começa importando as dependências necessárias:

```javascript
import figlet from 'figlet';
import chalk from 'chalk';
import readline from 'readline';
```

- figlet: Um programa para transformar texto comum em letras grandes. É usado neste projeto para criar arte ASCII a partir de texto.
- chalk: Usado para estilizar a saída do console.
- readline: Módulo integrado do Node.js para ler linhas de entrada de um fluxo legível.

Função startAnimation
A função startAnimation é exportada por este módulo. Esta função lida com a animação que é exibida quando a CLI é iniciada.
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

A função startAnimation começa definindo várias variáveis e funções que são usadas para controlar a animação.
Em seguida, inicia a animação chamando printAnimation() e printSkipText(). A animação continua até que todos os quadros tenham sido exibidos ou o usuário pressione Enter ou Espaço.

A função startAnimation é assíncrona porque espera a função startAnimation() terminar antes de prosseguir.
O '\u001B[?25l' é uma sequência de escape que oculta o cursor.

A função startAnimation() é chamada no final do script para iniciar a CLI:
```
startCLI();
```

#