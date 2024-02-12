"use strict";

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "fsd relative path checker",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        // example: app/entities/Entity
        const importTo = node.source.value

        // absolute path, example: C:\...\project\src..\File
        const fromFile = context.getFilename()

        context.report(node, 'ERROR MESSAGE')
      }
    };
  },
};
