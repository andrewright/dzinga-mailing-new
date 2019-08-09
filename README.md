# Welcome to Mail-generator
Newsletter templates building system base on MJML https://mjml.io  
Documentation: https://mjml.io/documentation/  
Line example: https://mjml.io/try-it-live


## Run
 - Install all packages
`$ npm install`
 - Start template watch
`$ npm dev`
 - Check that `/dist/en/` directory exist 
 - Build minified versions
`$ npm build`

## NPM scripts
- {name}:watch:dev will build html to `./target` directory and will watch for all files changes. Files will be rebuilt automatically on changes save.
- {name}:build:dev will build html to `./target` directory *.html files
- {name}:build:prod-dir build html to the special directory of the project, extension and layout  
(For example: `docs:build:prod-dir` script, build output to `../documents-generator-api/src/main/resources/templates/`)

## Attention
0. Name of all head common components might starts from `_` and have extention `.mjml` (example: `_footer.mjml`)
0. Common components might be located in `./mjml/common/components/`
    0. Local components might be located in local directory (example: `./mjml/keycloak/components/`)
0. To make strong always use `<strong>` tag
0. Links might have `<font color='red'>` to change link color
0. All `<mj-section>` can be on one level with other `<mj-section>`
0. Just `<mj-column>` can has width property
0. If `<mj-column>` has width and paddings - paddings will be included in width 
0. Popular tags (`<h1>`, `<p>`, `<a>`) can inherit styles from mail agents. Recommendation: Don't use tags in mail layout. Otherwise use `<mj-text mj-class="h1">` with attribute `mj-class` and styles in `<mj-style>`.
