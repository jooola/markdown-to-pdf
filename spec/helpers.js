'use babel';

import fs from 'fs';
import path from 'path';

export function createFixturePaths(tmpDir, fixtureName) {
  return [
    path.join(__dirname, `fixtures/${fixtureName}.md`),
    path.join(tmpDir.name, `${fixtureName}.md`),
    path.join(tmpDir.name, `${fixtureName}.pdf`),
  ];
}

export function isOnDisk(filePath) {
  return fs.existsSync(filePath);
}

export function isPDF(filePath) {
  return fs.readFileSync(filePath).slice(0, 4).toString('hex') === '25504446';
}

export function hasLines(filePath, expectLines) {
  const foundLines = fs.readFileSync(filePath).toString().split('\n');

  for (var expect of expectLines) {
    if (foundLines.indexOf(expect) === -1) {
      console.error(filePath);
      console.error(expect);
      return false;
    }
  }
  return true;
}

const { now } = Date;
const { setTimeout } = global;

export async function condition(why, condition) {
  const startTime = now();

  while (true) {
    await timeoutPromise(500);
    result = condition();
    if (result) {
      return result;
    }
    if (now() - startTime > 5000) {
      throw new Error('Timed out waiting on condition: ' + why);
    }
  }
}

export function timeoutPromise(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}
