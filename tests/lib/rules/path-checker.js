"use strict";

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


const ruleTester = new RuleTester();
ruleTester.run("path-checker", rule, {
  valid: [],

  invalid: [
    {
      code: "none",
      errors: [{ message: "", type: "" }],
    },
  ],
});
