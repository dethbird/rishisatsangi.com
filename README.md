# StoryStation
Tools for concepting and iterating on narrative projects pre-production.

## Deploy

### clone from GIT
```bash
git clone git@github.com:dethbird/explosioncorp-workstation.git workstation
cd workstation
```

### Initialize
#### Composer install base required libs for the build script to function:

```bash
curl -sS https://getcomposer.org/installer | php
php composer.phar install
```

#### Copy .env from .env.shadow and edit values
```bash
cp .env.shadow .env
vim .env
```

### Build script

#### Help

```bash
php scripts/build.php --help
```

displays help:

```bash

--cache/--cache
     Clear cache and reset permissions of cache directory


--configs/--configs
     Publish configs from .env


--css/--css
     Build .css files from .less


--help
     Show the help page for this command.


--js/--javascript
     Broswerify and minify the js


--js-page/--javascript-page <argument>
     File in "src/frontend/js/pages/<page>.js" to build


--npm/--npm
     Install node modules from package.json


--php/--php
     PHP/Composer install


--ugly/--uglify
     Uglify the compiled js (leave empty in dev)

```

#### build

##### build production:
All the options for the first time build.
```bash
php scripts/build.php --cache --configs --css --npm --js --php --ugly
```

### Permissions

```bash
chmod 755 workstation
cd workstation
chmod 755 public/
chmod 644 public/index.php public/.htaccess
```
