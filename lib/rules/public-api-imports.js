"use strict";

const { isPathRelative } = require('../helpers')

module.exports = {
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null,
    docs: {
      description: "fsd public api imports checker",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
    messages: {
      incorrectPath: 'Absolute import is allowed only from public API (index.ts)'
    }
  },

  create(context) {
    const alias = context.options[0]?.alias ?? ''

    const availableLayers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets'
    }

    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const toFile = alias ? value.replace(`${alias}/`, '') : value

        if (isPathRelative(toFile)) return

        const segments = toFile.split('/')
        const layer = segments[0]

        if (!availableLayers[layer]) return

        const isImportNotFromPublicAPI = segments.length > 2

        if (isImportNotFromPublicAPI) {
          context.report({ node, messageId: 'incorrectPath' })
        }
      }
    };
  },
};