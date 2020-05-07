// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

const MarkdownToPdf = require('../lib/markdown-to-pdf');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const tmp = require('tmp');
const { getPwd } = require('../lib/utils');
const { createFixturePaths, isOnDisk, isPDF, hasLines, condition } = require('./helpers');

describe('markdown-to-pdf:convert', () => {
  let tmpDir;

  let workspace;
  let editor;

  beforeEach(async () => {
    tmpDir = tmp.dirSync({ unsafeCleanup: true });

    workspace = await atom.views.getView(atom.workspace);
    await atom.packages.activatePackage('markdown-to-pdf');
  });

  afterEach(async () => {
    tmpDir.removeCallback();
  });

  it('should convert an existing markdown file to pdf', async () => {
    const [fixtureFilePath, inputFilePath, ouputFilePath] = createFixturePaths(tmpDir, 'simple');

    fs.copyFileSync(fixtureFilePath, inputFilePath);
    editor = await atom.workspace.open(inputFilePath);

    expect(editor).not.toBe(undefined);
    expect(editor.getPath()).toContain('simple.md');

    atom.commands.dispatch(workspace, 'markdown-to-pdf:convert');

    await condition('pdf file to be created', () => {
      return fs.readdirSync(tmpDir.name).indexOf('simple.pdf') !== -1;
    });

    expect(isOnDisk(ouputFilePath)).toBe(true);
    expect(isPDF(ouputFilePath)).toBe(true);
    expect(
      hasLines(ouputFilePath, [
        '%PDF-1.4',
        '/URI (http://daringfireball.net/projects/markdown/)>>>>',
        '/URI (http://www.fileformat.info/info/unicode/char/2163/index.htm)>>>>',
        '/URI (http://www.markitdown.net/)>>>>',
      ]),
    ).toBe(true);
  });

  it('should convert an existing markdown with picture file to pdf', async () => {
    const [fixtureFilePath, inputFilePath, ouputFilePath] = createFixturePaths(tmpDir, 'image');

    fs.copyFileSync(fixtureFilePath, inputFilePath);
    editor = await atom.workspace.open(inputFilePath);

    expect(editor).not.toBe(undefined);
    expect(editor.getPath()).toContain('image.md');

    atom.commands.dispatch(workspace, 'markdown-to-pdf:convert');

    await condition('pdf file to be created', () => {
      return fs.readdirSync(tmpDir.name).indexOf('image.pdf') !== -1;
    });

    expect(isOnDisk(ouputFilePath)).toBe(true);
    expect(isPDF(ouputFilePath)).toBe(true);
    expect(
      hasLines(ouputFilePath, [
        '%PDF-1.4',
        // TODO: Fix picture not properly embed in PDF files
        //       See https://github.com/BlueHatbRit/mdpdf/issues/79

        // '<</Type /XObject',
        // '/Subtype /Image',
        // '/Width 640',
        // '/Height 480',
        // '/ColorSpace /DeviceRGB',
        // '/BitsPerComponent 8',
        // '/Filter /FlateDecode',
      ]),
    ).toBe(true);
  });

  it('should convert an unsaved markdown file to pdf', async () => {
    const [fixtureFilePath] = createFixturePaths(tmpDir, 'simple');

    await atom.packages.activatePackage('tree-view');
    editor = await atom.workspace.open();
    editor.setText(fs.readFileSync(fixtureFilePath).toString());

    expect(editor.getPath()).toBeUndefined();

    atom.commands.dispatch(workspace, 'markdown-to-pdf:convert');

    const unknownOutputFilePath = await condition('pdf file to be created', () => {
      let cwd = getPwd();
      let files = fs.readdirSync(cwd);
      for (var i = 0; i < files.length; i++) {
        if (files[i].split('.').pop() === 'pdf') {
          return path.join(cwd, files[i]);
        }
      }
      return false;
    });

    expect(isOnDisk(unknownOutputFilePath)).toBe(true);
    expect(isPDF(unknownOutputFilePath)).toBe(true);
    expect(
      hasLines(unknownOutputFilePath, [
        '%PDF-1.4',
        '/URI (http://daringfireball.net/projects/markdown/)>>>>',
        '/URI (http://www.fileformat.info/info/unicode/char/2163/index.htm)>>>>',
        '/URI (http://www.markitdown.net/)>>>>',
      ]),
    ).toBe(true);
  });
});
