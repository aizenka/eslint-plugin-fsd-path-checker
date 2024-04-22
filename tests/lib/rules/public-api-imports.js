"use strict";

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});

const options = [
  {
    alias: '@'
  }
]

const optionsWithFilesPatterns = [
  {
    alias: '@',
    testFilesPatterns: ["**/*.{test,stories}.{ts,tsx}", "**/StoreDecorator.tsx"]
  }
]

ruleTester.run('public-api-imports', rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slice/addCommentFormSlice'",
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      options: optionsWithFilesPatterns
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions1, addCommentFormReducer } from '@/pages/Article/testing'",
      options: optionsWithFilesPatterns
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\story.stories.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      options: optionsWithFilesPatterns
    }
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/AddCommentForm/model/slice/addCommentFormSlice'",
      errors: [{ messageId: 'incorrectPublicApiPath' }],
      options,
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/AddCommentForm'"
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [{ messageId: 'incorrectPublicApiTestingPath' }],
      options: optionsWithFilesPatterns,
      output: null
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [{ messageId: 'incorrectPublicApiPath' }],
      options: optionsWithFilesPatterns,
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'"
    },
    // {
    //   filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\file.test.ts',
    //   code: "import { addCommentFormActions, addCommentFormReducer } from '@/pages/asd/testing",
    //   errors: [{ messageId: 'incorrectPublicApiTestingPath' }],
    //   options: optionsWithFilesPatterns
    // },
    // {
    //   filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\story.stories.tsx',
    //   code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/asd'",
    //   errors: [{ messageId: 'incorrectPublicApiTestingPath' }],
    //   options: optionsWithFilesPatterns
    // }
  ]
});
