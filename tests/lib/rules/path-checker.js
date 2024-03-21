"use strict";

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});

ruleTester.run('path-checker', rule, {
  valid: [
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\AddCommentForm',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slice/addCommentFormSlice'",
      errors: [],
      options: [
        {
          alias: '@'
        }
      ]
    }
  ],

  invalid: [
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\AddCommentForm',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/AddCommentForm/model/slice/addCommentFormSlice'",
      errors: [{message: 'Within a slice, all paths must be relative'}],
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\AddCommentForm',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/AddCommentForm/model/slice/addCommentFormSlice'",
      errors: [{ message: 'Within a slice, all paths must be relative' }],
      options: [
        {
          alias: '@'
        }
      ]
    }
  ],
});
