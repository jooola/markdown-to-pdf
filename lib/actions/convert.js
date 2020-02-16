'use babel';

import fs from 'fs';
import mdpdf from 'mdpdf';
import os from 'os';
import path from 'path';
import utils from '../utils';

export default async function() {
  const conf = atom.config.get('markdown-to-pdf');
  let editor = atom.workspace.getActiveTextEditor();

  let inputPath = editor.getPath();
  const outputPath = utils.getOutputPath(inputPath);

  if (inputPath === undefined) {
    // Create temporary input file for unsaved markdown content
    inputPath = path.join(os.tmpdir(), `${Date.now()}.md`);
    const bufferContent = editor.getBuffer().getText();
    fs.writeFileSync(inputPath, bufferContent);
  }

  const options = {
    source: inputPath,
    destination: outputPath,
    ghStyle: conf.ghStyle,
    defaultStyle: conf.defaultStyle,
    noEmoji: !conf.emoji,
    pdf: {
      format: conf.format,
      quality: 100,
      header: {
        height: null,
      },
      footer: {
        height: null,
      },
      border: {
        top: conf.border,
        left: conf.border,
        bottom: conf.border,
        right: conf.border,
      },
    },
  };

  try {
    atom.notifications.addInfo('Converting to PDF...', { icon: 'markdown' });
    await mdpdf.convert(options);
    atom.notifications.addSuccess('Converted successfully.', {
      detail: 'Output in ' + outputPath,
      icon: 'file-pdf',
    });
  } catch (e) {
    console.error(e);
  }

  return;
}
