# A Tumblr Theme

a tumblr theme

### Setup

- make sure [node.js](http://nodejs.org) and [roots](http://roots.cx) are installed
- clone this repo down and `cd` into the folder
- run `npm install`
- run `roots watch`
- ???
- get money

### Usage
- For local development:
  - `roots watch` or `roots compile`
- To compile a tumblr-ready version `roots compile -e production`

### Best practices

**Javascript:** it's easiest to inline your javascript so you don't have to host an external `.js` asset. To do this, try and keep all of your JS in 1 file and include it directly into your markup with jade.

```jade
//- assuming /main.coffee exists
head
  script: include:coffee-script ./main.coffee
```

**CSS:** [roots-inline-css](#) makes it extremely easy to locally use stylesheets but compile it inline. This, once again, prevents you from having to host the external `.css` asset.

```jade
//- assuming /style.styl exists
head
  link(rel='stylesheet', href='style.css')
  //- :point_up: compiles all styles into a <style> block
```
