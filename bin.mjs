#!/usr/bin/env node
import inquirer from 'inquirer';
import create from './index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import startAnimation from './animation.mjs';

// Função para obter o caminho do diretório atual
function getCurrentDirname(importMetaUrl) {
    const __filename = fileURLToPath(importMetaUrl);
    return dirname(__filename);
}

// Variável global para armazenar o nome do projeto e o modelo selecionado
let projectName;
let selectedModel;

// Função para iniciar a CLI
async function startCLI() {
    // Obter o caminho do diretório atual
    const __dirname = getCurrentDirname(import.meta.url);

    // Exibir a animação
    await startAnimation();

    // Limpar a tela antes de exibir a pergunta sobre o idioma
    process.stdout.write('\u001B[2J\u001B[0;0f');

    // Exibir a pergunta sobre o idioma somente após o término da animação ou se a animação for pulada
    showLanguageQuestion();
}

// Função para exibir a pergunta sobre o idioma
function showLanguageQuestion() {
    // Exibir a pergunta sobre o idioma
    const languageQuestion = {
        type: 'list',
        name: 'language',
        message: 'Escolha o idioma / Choose language:',
        choices: ['Português', 'English']
    };

    inquirer.prompt(languageQuestion).then(answer => {
        // Ajustar o idioma conforme a escolha do usuário
        const language = answer.language === 'English' ? 'en' : 'pt'; // Não é necessário remover espaços em branco da resposta
        // Definir o idioma globalmente
        global.language = language;

        // Chamar a função para selecionar o modelo do projeto
        selectProjectModel();
    });
}

// Função para selecionar o modelo do projeto
function selectProjectModel() {
    // Exibir a pergunta sobre o modelo do projeto
    const modelQuestion = {
        type: 'list',
        name: 'model',
        message: `${global.language === 'pt' ? 'Escolha o modelo do projeto:' : 'Choose project model:'}`,
        choices: ['vanilla-frontend', 'template-react'] // Adicionar opções para os modelos disponíveis
    };

    inquirer.prompt(modelQuestion).then(answer => {
        selectedModel = answer.model;

        // Limpar a tela após a seleção do modelo
        process.stdout.write('\u001B[2J\u001B[0;0f');

        // Chamar a função para criar o projeto
        createProject();
    });
}

// Função para criar o projeto
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
        // Armazenar o nome do projeto na variável global
        projectName = answer.name;

        // Obter o caminho para o diretório dos modelos
        const __dirname = getCurrentDirname(import.meta.url);
        const templatesDir = join(__dirname, '__templates'); // Acessar __templates diretamente
        const src = join(templatesDir, selectedModel);

        // Chamar a função create com o nome do projeto fornecido e o modelo correto
        create({
            name: projectName,
            template: src // Passar o caminho do modelo como uma opção
        });
    });
}

// Iniciar a CLI
startCLI();
