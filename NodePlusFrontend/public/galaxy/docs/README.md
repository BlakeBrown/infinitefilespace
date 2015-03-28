# [Galaxy Docs](https://galaxyui.com)

Learn, contribute, and play around with the Galaxy docs. It takes a minute to get started.

## How to use Harp

To start, make sure that [Harp](http://harpjs.com/) is installed:

```
sudo npm install -g harp
```

Then start Harp (make sure post 9000 is not in use):

```
harp server docs
```

Start Browsersync:

```
cd docs && browser-sync start --proxy 'localhost:9000' --files '*.css, docs/**, components/**'
```

## Compiling the static files
If you want to compile the static files just go to the root directory and run:

```
harp compile docs
```

The static files will be compiled into the `www/` folder, and you'll be able to see changes immediately after pushing to `gh-pages`.

## Contributing

Want to make the docs better? [We're accepting pull requests](https://github.com/Magmoz/galaxy/pulls).