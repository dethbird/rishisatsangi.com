# likedrop

### initialize

composer install required composer libs for the build script to function:

```bash
    curl -sS https://getcomposer.org/installer | php
    php composer.phar install
```

copy .env from .env.shadow and edit values
```bash
cp .env.shadow .#!/usr/bin/env
vim .env
```

### build help

```bash
php build.php --help
```

displays help:

```bash

--cache/--cache
     Clear cache and reset permissions of cache directory


--configs/--configs
     Publish configs from .env


--help
     Show the help page for this command.


--js/--javascript
     Broswerify and minify the js


--npm/--npm
     Install node modules from package.json


--php/--php
     PHP/Composer install


--ugly/--uglify
     Uglify the compiled js (leave empty in dev)

```


### build

build production:
```bash
php build.php -cache -configs -js -npm -php -ugly
```

build dev js:
```bash
php build.php -js
```
