'use babel';

export default {
  ghStyle: {
    title: 'Use Github markdown CSS',
    type: 'boolean',
    default: true,
    order: 1,
  },
  defaultStyle: {
    title: 'Use additional default styles',
    description: 'Provides basic things like border and font size',
    type: 'boolean',
    default: true,
    order: 2,
  },
  emoji: {
    title: 'Enable Emojis',
    description: 'Convert :tagname: style tags to Emojis',
    type: 'boolean',
    default: true,
    order: 3,
  },
  format: {
    title: 'Page Format',
    type: 'string',
    default: 'A4',
    enum: ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'],
    order: 4,
  },
  border: {
    title: 'Border Size',
    type: 'string',
    default: '20mm',
    order: 5,
  },
  outputDir: {
    title: 'Override output directory',
    description: 'Defaults to input file directory',
    type: 'string',
    default: '',
    order: 6,
  },
};
