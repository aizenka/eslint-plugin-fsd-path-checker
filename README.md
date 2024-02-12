# eslint-plugin-feature-sliced-design-path-checker

ESLint plugin for imports in FSD architecture

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-feature-sliced-design-path-checker`:

```sh
npm install eslint-plugin-feature-sliced-design-path-checker --save-dev
```

## Usage

Add `fsd-path-checker` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "fsd-path-checker"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "fsd-path-checker/rule-name": 2
    }
}
```

## Rules



