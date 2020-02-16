'use babel';

import fs from 'fs';
import path from 'path';

const markdownExtensions = ['markdown', 'md', 'mkd', 'mkdown', 'ron'];

function isMarkdown(filepath) {
  if (!filepath) return true;
  var extension = filepath.split('.').pop();
  if (markdownExtensions.indexOf(extension) !== -1) return true;
  return false;
}

function getPwd() {
  var treeDirPath = atom.packages.getActivePackage('tree-view').mainModule.treeView.selectedPath;
  if (!fs.lstatSync(treeDirPath).isDirectory()) {
    return path.dirname(treeDirPath);
  }
  return treeDirPath;
}

function getOutputPath(inputPath) {
  let outputDir;
  let outputPath;

  const userConfigOutputDir = atom.config.get('markdown-to-pdf.outputDir');
  if (userConfigOutputDir) {
    outputDir = path.resolve(userConfigOutputDir);
  }

  if (inputPath === undefined) {
    // Converting an unsaved file
    atom.notifications.addWarning('Input file not saved!.', { detail: 'Attempting conversion anyway.' });

    if (!outputDir) {
      outputDir = getPwd();
    }

    outputPath = path.join(outputDir, `${Date.now()}.pdf`);
  } else {
    if (!isMarkdown(inputPath)) {
      let detail = `Attempting conversion of '.${inputPath.split('.').pop()}' file.`;
      detail += ` Valid extensions are: ${markdownExtensions.join(', ')}.`;

      atom.notifications.addWarning('File not saved as markdown type.', {
        detail,
        dismissable: true,
      });
    }

    const parsePath = path.parse(inputPath);
    if (!outputDir) {
      outputDir = parsePath.dir;
    }

    outputPath = path.join(outputDir, `${parsePath.name}.pdf`);
  }
  return outputPath;
}

export default { getOutputPath, getPwd };
