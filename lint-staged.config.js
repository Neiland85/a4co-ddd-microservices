module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': ['eslint --fix --max-warnings=0', 'prettier --write', 'git add'],

  // JSON and YAML files
  '*.{json,yaml,yml}': ['prettier --write', 'git add'],

  // Markdown files with markdownlint
  '*.md': ['markdownlint --fix', 'prettier --write', 'git add'],

  // CSS and SCSS files
  '*.{css,scss,sass}': ['prettier --write', 'git add'],

  // Package.json specific formatting
  'package.json': ['prettier --write', 'git add'],
};
