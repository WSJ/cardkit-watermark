# CardKit Watermark

User-friendly web app for quickly cropping and adding credits to images for social media.

![Example of an image cropped for Twitter with credit and logo.](http://si.wsj.net/public/resources/images/OG-AF196_201507_NS_20150724153130.png)

* [About](#about)
* [Setup and run locally](#setup-and-run-locally)
* [Style](#style)
  * [Basic](#basic)
    * [Logo](#logo)
  * [Advanced](#advanced)
* [Tasks](#tasks)
  * [Build](#build)
  * [Deploy to server](#deploy-to-server)
  * [Deploy to GitHub pages](#deploy-to-github-pages)
  * [Test](#test)
* [Misc.](#misc)
* [Contributing](#contributing)
* [Version history](#version-history)

## About

CardKit Watermark is a fork of [CardKit](http://www.github.com/times/cardkit) (v1.0.0, by Chris Hutchinson for The Times and Sunday Times) customized to make image handling faster and easier. Because all image processing takes place in the browser, no server is required. However, It's currently limited to browsers which support the [download attribute](http://caniuse.com/#feat=download), i.e., Chrome and Firefox. Like CardKit, it is an Angular app.

## Setup and run locally

- Clone this repo.
- If necessary, install [Node](https://nodejs.org), [Grunt](http://gruntjs.com) and [Bower](http://bower.io).
- Run `npm install` and `bower install`.
- Run `grunt serve` to run the application.
- See the [Style](#style) section below to add your styles.

## Style

### Basic

Edit `dist/mode/watermark.config.json` to customize the options and styles. Here are some notes that may not be obvious.

- `sizes`, `margin`, `colors` are required. 'shadow' is recommended.
- `shadow` and `logo.src` use the values of `colors` to choose values. (Since shadow is a contrasting color to the caption fill, it should be set with an inverse color)
- The rest of the values are optional to set and have defaults. Many of them are for the design of the credit text.
- `maxWidth` sets the maximum file width you want exported (Custom allows larger sizes if set manually). This is useful for putting a cap on file sizes.
- Color sizes and size names (except `Custom` size) are used to make the button labels and may be edited or expanded.
- The `Custom` size has special settings the others don't to allow for user-defined sizes. `locked` will lock the aspect ratio by default. Custom will use the dimensions of the uploaded image.
- 'helpText' appears under the credit text field with guidance about your credit styles.
- Enabling `suffix` lets you make a shortcut to add text to the end of your credit, e.g., " for The Wall Street Journal"

#### Logo

- Set `"display": "block"` to show the logo by default.
- Set `"enabled": true` to expose a toggle to turn the logo on and off (the initial state will pull from `display`)
- Set `src` to a file path for one logo, or an object to select a different file based on the credit color (advanced editing can expose a color option for the logo separately).
- Use `svg` files for best quality over all sizes. Images are exported at up to twice the scale of the preset size (images are scaled up without going above their original dimensions).
- Place logo files in `app/logo/` so the build task doesn't minify or rename them.

### Advanced

Edit `app/mode/watermark.config.json` to customize the options and styles and make other changes to fit the app to your needs. Use `grunt build` to compile the edits into a production ready application. (See [Tasks](#tasks) below for more information.)

- Any custom fonts to be exported in the image may need to be included as part of the app (as opposed to referencing an outside file). Define data src information in `app/styles/_fonts.scss`
- Customize the tool page wrapper in `app/index.html` and `app/styles/`
- Edit `app/scripts/controllers/watermark.js` and `app/views/watermark.html` to customize the app further. See [CardKit](http://www.github.com/times/cardkit) for more information on the controller.

## Tasks

### Build

Run `grunt build` to build the application into the `/dist` directory.

### Deploy to server

Add server information (account and address) and destination directory to Gruntfile. Staging and production deploys are set up.

- `grunt deploy_staging`
- `grunt deploy_production`

### Deploy to GitHub pages

Edit remote URL for gh-pages in Gruntfile.

- `grunt buildcontrol:pages`

### Test

Tests are untouched from the CardKit base. Help setting up new tests would be appreciated.

## Misc.

Add a different use of CardKit by duplicating the watermark mode, controller and directive and adding another route to app.js (and a link to the route in the nav bar). This instance will play well with most of the original CardKit. However, some features may have been removed and the Angular version has been updated from 1.2 to 1.4.

## Contributing

Pull requests are welcome and I will do my best to stay on top of them. However, I may not have time to carefully consider and test every contribution, so please do your best to test code changes and include what you did, what it changed and why you did it. This is my first time using Angular, so I expect I broke many Angular conventions and rules. This code was originally written to work and not to be an Angular demo.

## Version history

__v0.9.0__

* Initial release

## License

[ISC](/LICENSE)
