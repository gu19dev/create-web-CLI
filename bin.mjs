#!/usr/bin/env node
import inquirer from 'inquirer';
import create from './index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import startAnimation from './animation.mjs';

function getCurrentDirname(importMetaUrl) {
    const __filename = fileURLToPath(importMetaUrl);
    return dirname(__filename);
}

let projectName;
let selectedModel;

async function startCLI() {
    const __dirname = getCurrentDirname(import.meta.url);

    await startAnimation();

    process.stdout.write('\u001B[2J\u001B[0;0f');

    showLanguageQuestion();
}

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

startCLI();
