"use strict";

const path = require('path')
const { isPathRelative } = require('../helpers')
const micromatch = require('micromatch')

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
          },
          testFilesPatterns: {
            type: 'array'
          }
        }
      }
    ],
    messages: {
      incorrectPublicApiPath: 'Absolute import is allowed only from public API (index.ts)',
      incorrectPublicApiTestingPath: 'Test data must be imported from the public API for tests (testing.ts)'
    }
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {}

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
        // [entities, article, testing]
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if (isImportNotFromPublicAPI && !isTestingPublicApi) {
          context.report({ node, messageId: 'incorrectPublicApiPath' })
          return
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename()
          const normalizedPath = path
            .toNamespacedPath(currentFilePath)
            .replace(/\\/g, '/')

          const isCurrentFileTesting = testFilesPatterns.some(
            pattern => micromatch.isMatch(normalizedPath, pattern)
          )

          if (!isCurrentFileTesting) {
            context.report({ node, messageId: 'incorrectPublicApiTestingPath' })
          }
        }
      }
    };
  },
};