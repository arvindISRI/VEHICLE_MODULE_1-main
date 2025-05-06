## vehicle-module

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO


*******RS Changes ***********
Alternative using npm-force-resolutions
Install resolutions package and TypeScript providing considered version explicitly:

 npm i -D npm-force-resolutions typescript@3.6.4

Add a resolution for TypeScript and preinstall script into package.json to a corresponding code blocks:

JSON { "scripts": { "preinstall": "npx npm-force-resolutions" }, "resolutions": { "typescript": "3.6.4" } }

Run npm install to trigger preinstall script and bumping TypeScript version into package-lock.json

Run npm run build, should produce no errors