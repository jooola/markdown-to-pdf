'use babel';

import MarkdownToPdf from '../lib/markdown-to-pdf';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import tmp from 'tmp';
import { getPwd } from '../lib/utils';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

function checkIsPDF(filePath) {
  return (
    fs
      .readFileSync(filePath)
      .slice(0, 4)
      .toString('hex') === '25504446'
  );
}

describe('MarkdownToPdf', () => {
  let workspaceElement, activationPromise;
  let tmpDir;
  let inputFilePath, ouputFilePath, fixtureFilePath;
  let editor;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('markdown-to-pdf');

    tmpDir = tmp.dirSync();
    fixtureFilePath = path.join(__dirname, 'fixtures/simple.md');
    inputFilePath = path.join(tmpDir.name, 'simple.md');
    ouputFilePath = path.join(tmpDir.name, 'simple.pdf');
  });

  afterEach(() => {
    tmpDir.removeCallback();
  });

  describe('when the markdown-to-pdf:convert event is triggered on a saved file', () => {
    beforeEach(() => {
      fs.copyFileSync(fixtureFilePath, inputFilePath);

      waitsForPromise(() => atom.workspace.open(inputFilePath).then(el => (editor = el)));
      waitsForPromise(() => activationPromise);
    });

    it('should convert the file to pdf', () => {
      expect(editor.getPath()).toContain('simple.md');

      atom.commands.dispatch(workspaceElement, 'markdown-to-pdf:convert');

      waitsFor('the pdf file to be created', () => {
        return fs.readdirSync(tmpDir.name).indexOf('simple.pdf') !== -1;
      });

      runs(() => {
        expect(ouputFilePath).toExistOnDisk();
        expect(checkIsPDF(ouputFilePath)).toBe(true);
      });
    });
  });

  describe('when the markdown-to-pdf:convert event is triggered on a unsaved file', () => {
    let unknownOutputFilePath;

    beforeEach(() => {
      waitsForPromise(() => atom.packages.activatePackage('tree-view'));
      waitsForPromise(() => atom.workspace.open().then(el => (editor = el)));
      editor.setText(fs.readFileSync(fixtureFilePath).toString());
      waitsForPromise(() => activationPromise);
    });

    it('should convert the content to pdf', () => {
      expect(editor.getPath()).toBeUndefined();

      atom.commands.dispatch(workspaceElement, 'markdown-to-pdf:convert');

      waitsFor('the pdf file to be created', () => {
        let cwd = getPwd();
        let files = fs.readdirSync(cwd);
        for (var i = 0; i < files.length; i++) {
          if (files[i].split('.').pop() === 'pdf') {
            return (unknownOutputFilePath = path.join(cwd, files[i]));
          }
        }
      });

      runs(() => {
        expect(unknownOutputFilePath).toExistOnDisk();
        expect(checkIsPDF(unknownOutputFilePath)).toBe(true);
      });
    });

    afterEach(() => {
      rimraf.sync(unknownOutputFilePath);
    });
  });
});
