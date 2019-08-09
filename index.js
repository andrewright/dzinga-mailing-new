const path = require('path');
const fs = require('fs');
const watch = require('node-watch');
const chalk = require('chalk');
const mjml2html = require('mjml');

/* Environment config */
const inputPath = process.argv[2] || './mjml/**/';
const envConfig = {
  dev: {
    outputPath: false,
    outputExtension: '.html',
    wrap: false,
    options: {
      filePath: path.join(__dirname, inputPath + '/components'),
      beautify: true,
      minify: true,
      minifyOptions: {
        minifyCSS: true,
        collapseWhitespace: false,
        removeEmptyAttributes: false
      },
      juicePreserveTags: {
        freeMarker: {
          start: "<#",
          end: "</#"
        },
        imgTag: {
          start: "<img",
          end: "/>"
        },
        brTag: {
          start: "<br",
          end: "/>"
        }
      }
    }
  },
  prod: {
    outputPath: false,
    outputExtension: '.email',
    wrap: true,
    options: {
      filePath: path.join(__dirname, inputPath + '/components'),
      beautify: false,
      minify: true,
      minifyOptions: {
        minifyCSS: true,
        collapseWhitespace: true,
        removeEmptyAttributes: false,
        keepClosingSlash: false
      },
      juicePreserveTags: {
        freeMarker: {
          start: "<#",
          end: "</#"
        },
        imgTag: {
          start: "<img",
          end: "/>"
        },
        brTag: {
          start: "<br",
          end: "/>"
        }
      }
    }
  }
};

function getListFiles(dirPath) {
  const absolutePath = path.resolve(__dirname, dirPath);
  let filesList = fs.readdirSync(absolutePath);
  filesList = filesList.filter(function (e) {
    return path.extname(e).toLowerCase() === '.mjml';
  });
  return filesList;
}

function getTemplateFromFile(path, file) {
  return fs.readFileSync(path + file, 'utf-8');
}

function compileHtml(template, options) {
  try {
    return mjml2html(template, options).html;
  } catch (error) {
    console.log(chalk.red('Error #' + error));
  }
}

function wrapHtml(html) {
  return `<?xml version="1.0" encoding="utf-8"?>
    <mail>
        <to>\${email\}</to>
        <htmlType>true</htmlType>
        <subject>Some Subject</subject>
        <body>
            <![CDATA[
                ${html}
            ]]>
        </body>
    </mail>
`;
}

function createDir(pathToCreate) {
  if (!fs.existsSync(pathToCreate)) {
    fs.mkdirSync(pathToCreate, {mode : '0777', recursive: true});
  }
}

function prepareOutputDir(outputPath) {
  let createdDir;
  if (outputPath) {
    createDir(outputPath);
    createdDir = outputPath;
  } else if (!outputPath && inputPath) {
    const dirToCreate = inputPath.replace('mjml', 'html');
    console.log(dirToCreate);
    createDir(dirToCreate);
    createdDir = dirToCreate;
  } else {
    createDir('./html/');
    createdDir = './html/'
  }
  return createdDir;
}

function createFile(content, outputPath, filename, extension) {
  console.log(chalk.white('Input file:' + filename));
  console.log(chalk.white('Output dir:' + outputPath));
  try {
    fs.writeFileSync(outputPath + filename + extension, content);
    console.log(chalk.greenBright('Output file:' + filename + extension));
  } catch (error) {
    console.log(chalk.red('Error #' + error));
  }
}

function compileFile(file, config) {
  const extension = (config.outputExtension || '.html');
  const outputPathChecked = prepareOutputDir(config.outputPath);
  let output = getTemplateFromFile(inputPath, file);
  output = compileHtml(output, config.options);
  if (config.wrap) {
    output = wrapHtml(mjml2html);
  }
  
  createFile(output, outputPathChecked, file, extension);
}

function runCompiller(inputPath, envConfig) {
  const env = process.argv[3] || 'dev';
  const config = envConfig[env];
  const watchMode = process.argv[4] === 'watch';
  const watchOptions = {recursive: true};
  const filesList = getListFiles(inputPath) || [];
  console.log('index.js:158', filesList);
  filesList.forEach(file => {
    compileFile(file, config);
  });
  if (watchMode) {
    watch(inputPath, watchOptions, (evt, name) => {
      if (evt === 'update') {
        console.log('----------/Changed/------------');
        console.log('Changed:', name);
        const nameArr = name.split('\\');
        compileFile(nameArr[nameArr.length - 1], config);
        console.log('--------------------------------');
      }
    });
  }
};

runCompiller(inputPath, envConfig);
