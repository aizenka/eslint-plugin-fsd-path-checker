"use strict";

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});

const options = [
  {
    alias: '@'
  }
]

const optionsWithIgnorePatterns = [
  {
    alias: '@',
    ignoreImportPatterns: ["**/StoreProvider"]
  }
]

ruleTester.run('layer-imports', rule, {
  valid: [
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\features\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\shared\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\features\\Article',
      code: "import { addCommentFormActions1, addCommentFormReducer } from '@/entities/Article'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\widgets\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'react-router-dom'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\index.ts',
      code: "import { addCommentFormActions } from '@/app/providers/StoreProvider'",
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\Article',
      code: "import { StateSchema } from '@/app/Article/providers/StoreProvider'",
      options: optionsWithIgnorePatterns
    }
  ],

  invalid: [
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\shared\\Article',
      code: "import { StateSchema } from '@/entities/Article'",
      errors: [{ messageId: 'violationFSDHierarchy' }],
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\entities\\Article',
      code: "import { StateSchema } from '@/features/Article'",
      errors: [{ messageId: 'violationFSDHierarchy' }],
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\features\\Article',
      code: "import { StateSchema } from '@/widgets/Article'",
      errors: [{ messageId: 'violationFSDHierarchy' }],
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\widgets\\Article',
      code: "import { StateSchema } from '@/pages/Article'",
      errors: [{ messageId: 'violationFSDHierarchy' }],
      options
    },
    {
      filename: 'C:\\Users\\asd\\Desktop\\f1\\f2\\src\\pages\\Article',
      code: "import { StateSchema } from '@/app/Article'",
      errors: [{ messageId: 'violationFSDHierarchy' }],
      options
    },
  ]
});
