# HIPPIE

> WORK IN PROGRESS (it is not ready to be used)

This is a [node.js](https://nodejs.org/) based generator for static HTML based sites.

It uses the [gulp](https://gulpjs.com/) module to fiddle everything together. Styling is powered by the CSS extension language [SASS](https://sass-lang.com/). The HTML pages itself are made with the templating engine [Nunjucks](https://mozilla.github.io/nunjucks/).

## USAGE

Clone the repo `https://github.com/sthag/hippie.git` to a folder to create your build environment.

Change to the newly created folder. By default this would be *hippie*.

Run the command `npm install`.
This will install all node.js dependencies into the folder *node_modules*.

The command `gulp --tasks` will give you an overview of possible actions.

Run the command `gulp` for a live development environment.
This will create a folder *build* with the resulting files to use.
Also the source files will be watched for changes which are reflected live at [localhost:3000](htpp://localhost:3000)

`gulp build` will create the resulting *build* directory ready for deployment.

## LOGIC

> Klassennamen enthalten Objektnamen und Funktionen
> Sie sind mit `-` und `_` unterteilt.
> Der Bindestrich `-` trennt Objektnamen von Funktionen. Der Unterstrich `_` wiederum unterteilt Funktionsbezeichnungen.
