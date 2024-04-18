import figlet from 'figlet';
import chalk from 'chalk';
import readline from 'readline';
const startAnimation = () => {
    const fonts = '';
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
