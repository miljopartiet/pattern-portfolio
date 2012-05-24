Markup for Miljöpartiet
==

Markup for the new mp.se using [Middleman](http://middlemanapp.com/)

## Install

    bundle install

## Run Middleman

    middleman server

The site will be available at http://localhost:4567

## Deploy with Deplol

Make sure you have [setup Deplol on your machine](https://github.com/Oktavilla/Deplol#a-platform-for-deploying-and-serving-static-sites).

Build the deployable folder.

    middleman build

Commit and push your changes and then deploy to Deplol.

    git push deplol master