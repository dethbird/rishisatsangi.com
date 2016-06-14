# likedrop

### initialize

composer install required composer libs for the build script to function:

```bash
    curl -sS https://getcomposer.org/installer | php
    php composer.phar install
```

### build help

```bash
php build.php --help
```

displays help:

```bash

-c/--cache
     Clear cache and reset permissions of cache directory


--help
     Show the help page for this command.


-j/--javascript
     Broswerify and minify the js


-n/--npm
     Install node modules from package.json


-p/--php
     PHP/Composer install


-u/--uglify
     Uglify the compiled js (leave empty in dev)
```


### build

build production:
```bash
php build.php -c -j -n -p -u
```

build dev js:
```bash
php build.php -j
```
