"use strict";

const path = require('path')
const { isPathRelative, getFileSegments } = require('../helpers')
const micromatch = require('micromatch')

module.exports = {
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null,
    docs: {
      description: "fsd layer import checker",
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
          ignoreImportPatterns: {
            type: 'array'
          }
        }
      }
    ],
    messages: {
      violationFSDHierarchy: 'A layer can only import layers below it'
    }
  },

  create(context) {
    const availableLayers = {
      'app': 'app',
      'pages': 'pages',
      'widgets': 'widgets',
      'features': 'features',
      'entities': 'entities',
      'shared': 'shared'
    }

    const layerHierarchy = {
      'app': ['pages', 'widgets', 'features', 'entities', 'shared'],
      'pages': ['widgets', 'features', 'entities', 'shared'],
      'widgets': ['features', 'entities', 'shared'],
      'features': ['entities', 'shared'],
      'entities': ['entities', 'shared'],
      'shared': ['shared']
    }

    const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {}

    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename()
      const normalizedPath = path.toNamespacedPath(currentFilePath)
      const segments = getFileSegments(normalizedPath)

      return segments[0]
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, ''): value
      const segments = importPath?.split('/')

      return segments[0]
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const currentFileLayer = getCurrentFileLayer()
        const importLayer = getImportLayer(importPath)

        if (isPathRelative(importPath)) return

        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) return

        const isIgnored = ignoreImportPatterns.some(
          pattern => micromatch.isMatch(importPath, pattern)
        )

        if (isIgnored) return

        if (!layerHierarchy[currentFileLayer].includes(importLayer)) {
          context.report({ node, messageId: 'violationFSDHierarchy' })
        }
      }
    };
  },
};