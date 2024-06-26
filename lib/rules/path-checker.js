"use strict";

const path = require('path')
const { isPathRelative, getFileSegments } = require('../helpers')

module.exports = {
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null,
    docs: {
      description: "fsd relative path checker",
      recommended: false,
      url: null,
    },
    fixable: 'code',
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
      incorrectPath: 'Within a slice, all paths must be relative'
    }
  },

  create(context) {
    const alias = context.options[0]?.alias ?? ''

    return {
      ImportDeclaration(node) {
        // example: app/entities/Entity
        const value = node.source.value
        const toFile = alias ? value.replace(`${alias}/`, '') : value

        // absolute path, example: C:\...\project\src..\File
        const fromFile = context.getFilename()

        if (pathShouldBeRelative(fromFile, toFile)) {
          context.report({
            node,
            messageId: 'incorrectPath',
            fix: (fixer) => {
              const projectFromPath = path.toNamespacedPath(fromFile)
              // e.g entities/Article (without filename)
              const normalizedPath = getFileSegments(projectFromPath)
                .slice(0, -1)
                .join('/')

              let relativePath = path.relative(normalizedPath, toFile)

              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath
              }

              return fixer.replaceText(node.source, `'${relativePath}'`)
            }
          })
        }
      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets'
}

const pathShouldBeRelative = (from, to) => {
  if (isPathRelative(to)) return false

  const toArray = to.split('/')
  const toLayer = toArray[0]
  const toSlice = toArray[1]

  if (!toLayer || !toSlice || !layers[toLayer]) return false

  const projectFromPath = path.toNamespacedPath(from)
  const segments = getFileSegments(projectFromPath)

  const fromLayer = segments[0]
  const fromSlice = segments[1]

  if (!fromLayer || !fromSlice || !layers[fromLayer]) return false

  return fromLayer === toLayer && fromSlice == toSlice
}

// import {
//   addCommentFormActions,
//   addCommentFormReducer
// } from '@/entities/AddCommentForm/model/slice/addCommentFormSlice'

// console.log(pathShouldBeRelative('C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\Article', 'entities/Article/fasfasfas'))
// console.log(pathShouldBeRelative('C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\Article', 'entities/ASdasd/fasfasfas'))
// console.log(pathShouldBeRelative('C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\Article', 'features/Article/fasfasfas'))
// console.log(pathShouldBeRelative('C:\\Users\\asd\\Desktop\\f1\\f2\\src\\features\\Article', 'features/Article/fasfasfas'))
// console.log(pathShouldBeRelative('C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\Article', 'app/index.tsx'))
// console.log(pathShouldBeRelative('C:/Users/asd/Desktop/f1/f2/src/entities/Article', 'entities/Article/asfasf/asfasf'))
// console.log(pathShouldBeRelative('C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\Article', '../../model/selectors/getSidebarItems'))
