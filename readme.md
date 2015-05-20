# sprout-roots-tumblr
a sprout template for building tumblr themes with roots

### Installation
- `npm install sprout-cli -g`
- `sprout add tumblr git@github.com:carrot/sprout-roots-tumblr.git`
- `sprout new tumblr mytumblrtheme`

### Usage
- For local development `roots watch` or `roots compile`
- To compile a tumblr-ready version `roots compile -e production`

### Options
- **theme** (name of template from [themes](themes))

### Features
- uses [roots](http://roots.cx) as your build tool
- uses [roots-tumblr](https://github.com/carrot/roots-tumblr) to pass tumblr data to your [tumblr variable blocks](http://buildthemes.tumblr.com/ch1/variables-blocks) during compilation
- uses [jade](http://jade-lang.com/) for markup
- uses [stylus](https://learnboost.github.io/stylus/) for CSS
- uses [roots-inline-css](https://github.com/carrot/roots-inline-css) to inline all of your CSS so you don't have to host this additional asset
- has over 60 [starting tumblr themes](themes) for you to pick from **(experimental: we haven't thoroughly tested all of these yet)**
