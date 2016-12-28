<?php

define("APPLICATION_PATH", __DIR__ . "/../");
date_default_timezone_set('America/New_York');
require_once APPLICATION_PATH . 'vendor/autoload.php';
use Colors\Color;
use MeadSteve\Console\Shells\BasicShell;
use Commando\Command;
use josegonzalez\Dotenv\Loader;
use Symfony\Component\Yaml\Yaml;

$cmd = new Command();
$cmd->beepOnError();
$cmd->option('cache')
    ->boolean()
    ->aka('cache')
    ->describedAs('Clear cache and reset permissions of cache directory');
$cmd->option('l')
    ->boolean()
    ->aka('layout')
    ->describedAs('Build responsive .less for layout objects (x,y) coords, dimensions');
$cmd->option('css')
    ->boolean()
    ->aka('css')
    ->describedAs('Build .css files from .less');
$cmd->option('configs')
    ->boolean()
    ->aka('configs')
    ->describedAs('Publish configs from .env');
$cmd->option('php')
    ->boolean()
    ->aka('php')
    ->describedAs('PHP/Composer install');
$cmd->option('npm')
    ->boolean()
    ->aka('npm')
    ->describedAs('Install node modules from package.json');
$cmd->option('js')
    ->boolean()
    ->aka('javascript')
    ->describedAs('Broswerify and minify the js');
$cmd->option('ugly')
    ->boolean()
    ->aka('uglify')
    ->describedAs('Uglify the compiled js (leave empty in dev)');
$cmd->option('js-page')
    ->aka('javascript-page')
    ->describedAs('File in "src/frontend/js/pages/<page>.js" to build');
$c = new Color();
$dotenv = (new Loader('.env'))
          ->parse()
          ->toArray();
$shell = new BasicShell();
$sizes = [
    1900,
    1366,
    1280,
    1024,
    960,
    800,
    620,
    480,
    400,
    300
];

function numberToCss($num, $scale = 1){

    echo 'num: '.$num . PHP_EOL;
    if ($num==0) {
        return $num;
    }

    $suffix = substr($num, -1);
    $number = str_replace($suffix, null, $num);
    echo 'number: '.$number . PHP_EOL;
    echo 'suffix: '.$suffix . PHP_EOL;
    # case 'auto' or  other string
    if($number && !is_numeric($number)) {
        echo 'num not numeric' . PHP_EOL;
        return $num;
    }

    if(is_numeric($suffix)) {
        echo 'suffix numeric' . PHP_EOL;
        return ($num * $scale) . 'px';
    } else {
        return ($number * $scale) . $suffix;
    }
};
function propNameToCss($name) {
    return str_replace('_', '-', $name);
}
function tabs($tab) {
    $out = '';
    $i = 0;
    while($i < $tab) {
        $out .= '    ';
        $i++;
    }
    return $out;
}
function defToCss($object, $def, $tab = 0) {
    global $sizes;
    $_out = tabs($tab) . $def. ' {' .  PHP_EOL;
    if (isset($object['classes'])) {
        foreach($object['classes'] as $className) {
            $_out .= tabs($tab + 1) . '.'. $className . ';' . PHP_EOL;
        }
    }
    if (isset($object['dimensions'])) {
        $_out .= tabs($tab + 1) . 'width: '. numberToCss($object['dimensions']['width']).';' . PHP_EOL;
        $_out .= tabs($tab + 1) . 'height: '. numberToCss($object['dimensions']['height']).';' . PHP_EOL;
    }
    if (isset($object['location'])) {
        $_out .= tabs($tab + 1) . 'top: '. numberToCss($object['location']['top']).';' . PHP_EOL;
        $_out .= tabs($tab + 1) . 'left: '. numberToCss($object['location']['left']).';' . PHP_EOL;
    }
    if (isset($object['box'])) {
        foreach($object['box'] as $k=>$v) {
            $_out .= tabs($tab + 1) .$k.': '. numberToCss($v).';' . PHP_EOL;
        }
    }
    if (isset($object['props'])) {
        foreach($object['props'] as $k=>$v) {
            $_out .= tabs($tab + 1) . propNameToCss($k).': '. numberToCss($v).';' . PHP_EOL;
        }
    }

    # generate sizes
    $lastSize = 1920;
    foreach ($sizes as $size) {
        $scale = $size / 1920;
        $_out .= tabs($tab + 1) . '@media (min-width: '.$size.'px) and (max-width: ' .($lastSize - 1). 'px) {' . PHP_EOL;
        if (isset($object['dimensions'])) {
            $_out .= tabs($tab + 2) . 'width: '. numberToCss($object['dimensions']['width'], $scale).';' . PHP_EOL;
            $_out .= tabs($tab + 2) . 'height: '. numberToCss($object['dimensions']['height'], $scale).';' . PHP_EOL;
        }
        if (isset($object['location'])) {
            $_out .= tabs($tab + 2) . 'top: '. numberToCss($object['location']['top'], $scale).';' . PHP_EOL;
            $_out .= tabs($tab + 2) . 'left: '. numberToCss($object['location']['left'], $scale).';' . PHP_EOL;
        }
        if (isset($object['box'])) {
            foreach($object['box'] as $k=>$v) {
                $_out .= tabs($tab + 2) . $k.': '. numberToCss($v, $scale).';' . PHP_EOL;
            }
        }
        if (isset($object['props'])) {
            foreach($object['props'] as $k=>$v) {
                $_out .= tabs($tab + 2) . propNameToCss($k).': '. numberToCss($v, $scale).';' . PHP_EOL;
            }
        }
        $_out .= tabs($tab + 1) . '}' . PHP_EOL;
        $lastSize = $size;

    }

    if(isset($object['subdefs'])) {
        if(isset($object['subdefs']['classes'])) {
            foreach($object['subdefs']['classes'] as $class) {
                $_out .= defToCss($class, $class['name'], $tab + 1);
            }
        }
    }

    $_out .= tabs($tab) . '}' . PHP_EOL;
    return $_out;
}
    if($cmd['cache']) {
        echo $c(
"   ___           _
  / __\__ _  ___| |__   ___
 / /  / _` |/ __| '_ \ / _ \
/ /__| (_| | (__| | | |  __/
\____/\__,_|\___|_| |_|\___|
                            "
            )
            ->white()->bold()->highlight('blue') . PHP_EOL;

        $shell->executeCommand('rm', array(
            "-rf",
            "cache"
        ));
        $shell->executeCommand('mkdir', array(
            "cache"
        ));
        $shell->executeCommand('mkdir', array(
            "cache/gdrive"
        ));
        $shell->executeCommand('mkdir', array(
            "cache/gdrive/thumbnails"
        ));
        $shell->executeCommand('chmod', array(
            "777",
            "cache"
        ));

        echo $c("Cache setup complete.")
            ->green()->bold() . PHP_EOL;
    }

    if($cmd['configs']) {
        echo $c(
"   ___             __ _
  / __\___  _ __  / _(_) __ _ ___
 / /  / _ \| '_ \| |_| |/ _` / __|
/ /__| (_) | | | |  _| | (_| \__ \
\____/\___/|_| |_|_| |_|\__, |___/
                        |___/     "
            )
            ->white()->bold()->highlight('blue') . PHP_EOL;


        $shadows = $shell->executeCommand('find', array(
            "configs",
            "-name",
            "*.shadow*"
        ));

        foreach($shadows as $shadowFilePath) {
            $configFilePath = str_replace(".shadow", "", $shadowFilePath);
            echo $c($shadowFilePath.' -> '.$configFilePath)
              ->yellow() . PHP_EOL;
            $resp = $shell->executeCommand('cp', array(
                $shadowFilePath,
                $configFilePath
            ));
            foreach ($dotenv as $k => $v) {
                $v = trim($v);
                if($v!=""){
                    try {
                        echo $c("sed -i 's/:".$k."/".addcslashes($v, "/")."/g' ".$configFilePath)
                          ->white() . PHP_EOL;
                        $resp = $shell->executeCommand('sed', array(
                            "-i",
                            "'s/:".$k."/".addcslashes($v, "/")."/g'",
                            $configFilePath
                        ));
                    } catch (Exception $e) {
                        var_dump($e);
                        var_dump(addcslashes($v, "/"));
                        exit();
                    }
                }
            }
        }

        echo $c("Configs published.")
            ->green()->bold() . PHP_EOL;
    }

    // php and composer
    if($cmd['php']) {
        echo $c(
"   ___        ___      __    ___
  / _ \/\  /\/ _ \    / /   / __\___  _ __ ___  _ __   ___  ___  ___ _ __
 / /_)/ /_/ / /_)/   / /   / /  / _ \| '_ ` _ \| '_ \ / _ \/ __|/ _ \ '__|
/ ___/ __  / ___/   / /   / /__| (_) | | | | | | |_) | (_) \__ \  __/ |
\/   \/ /_/\/      /_/    \____/\___/|_| |_| |_| .__/ \___/|___/\___|_|
                                               |_|                        "
        )
            ->white()->bold()->highlight('blue') . PHP_EOL;

        $shell->executeCommand('rm', array(
            "-rf",
            "vendor"
        ));

        $shell->executeCommand('rm', array(
            "-rf",
            "composer.lock"
        ));

        $resp = $shell->executeCommand('curl', array(
            "-sS",
            "https://getcomposer.org/installer",
            "|",
            "php"
        ));
        echo implode(PHP_EOL, $resp) . PHP_EOL;

        $resp = $shell->executeCommand('php', array(
            "composer.phar",
            "install",
            "|",
            "php"
        ));

        $resp = $shell->executeCommand('rm', array(
            "-rf",
            "composer.phar"
        ));

        $resp = $shell->executeCommand('rm', array(
            "-rf",
            "composer.lock"
        ));

        $resp = $shell->executeCommand('chmod', array(
            "-R",
            "777",
            "configs/*"
        ));

        echo $c("PHP / Composer complete.")
            ->green()->bold() . PHP_EOL;
    }

    // node
    if($cmd['npm']) {
        echo $c(
"     __          _                            _       _
  /\ \ \___   __| | ___   _ __ ___   ___   __| |_   _| | ___  ___
 /  \/ / _ \ / _` |/ _ \ | '_ ` _ \ / _ \ / _` | | | | |/ _ \/ __|
/ /\  / (_) | (_| |  __/ | | | | | | (_) | (_| | |_| | |  __/\__ \
\_\ \/ \___/ \__,_|\___| |_| |_| |_|\___/ \__,_|\__,_|_|\___||___/
                                                                  ")
            ->white()->bold()->highlight('blue') . PHP_EOL;
        $resp = $shell->executeCommand('rm', array(
            "-rf",
            "node_modules"
        ));
        $resp = $shell->executeCommand('npm', array(
            "install"
        ));

        echo implode(PHP_EOL, $resp) . PHP_EOL;

        echo $c("Node modules complete.")
            ->green()->bold() . PHP_EOL;
    }

    // javascript
    if($cmd['javascript']) {

        echo $c("Javascript")
            ->white()->bold()->highlight('blue') . PHP_EOL;

        if($cmd['js-page']){
            $frontendFiles = ["src/frontend/js/pages/" . $cmd['js-page'] . ".js"];
        } else {
            $frontendFiles = $shell->executeCommand('find', array(
                "src/frontend/js/pages/",
                "-name",
                "'*.js'"
            ));
        }
        foreach($frontendFiles as $file){
            if($file) {
                $outputFile = str_replace("src/frontend", "public", $file);

                echo $c($outputFile)
                    ->yellow()->bold() . PHP_EOL;

                $command = [
                    $file,
                    "-o",
                    $outputFile,
                    "-t",
                    "[ babelify --presets [ es2015 react stage-2 ] ]"
                ];

                try {
                    $browserifyList = $shell->executeCommand('browserify', array_merge($command, ["--list"]));
                } catch (Exception $e) {
                    echo $c(print_r($e->getMessage(), true))->dark() . PHP_EOL;
                    echo $c('EXCEPTION')->red()->bold() . PHP_EOL;
                    echo $c('browserify '  . implode(' ', $command))->yellow()->bold() . PHP_EOL;
                    exit();
                }

                try {
                    $browserifyResponse = $shell->executeCommand('browserify', $command);
                } catch (Exception $e) {
                    echo $c(print_r($e->getMessage(), true))->dark() . PHP_EOL;
                    echo $c('EXCEPTION')->red()->bold() . PHP_EOL;
                    echo $c('browserify '  . implode(' ', $command))->yellow()->bold() . PHP_EOL;
                    exit();
                }

                foreach($browserifyList as $builtFrom) {
                    echo $c("   " . $builtFrom)
                        ->white() . PHP_EOL;
                }

                if($cmd['uglify']){
                    $resp = $shell->executeCommand('uglifyjs', array(
                        $outputFile,
                        "-o",
                        $outputFile
                    ));
                }

                // report
                echo $c(
                    "   browserified from " .
                    count($browserifyList) .
                    " modules" .
                    ( $cmd['uglify'] ? " and uglified" : null ).
                    ": ".
                    round(filesize($outputFile)/1024, 2) . " Kb.")
                    ->green()->bold() . PHP_EOL;
            }
        }
    }

    // css
    if($cmd['css']) {
        echo $c("CSS")
            ->white()->bold()->highlight('blue') . PHP_EOL;
        $frontendFiles = $shell->executeCommand('find', array(
            "src/frontend/css/",
            "-name",
            "'*.less'"
        ));
        foreach($frontendFiles as $file){
            if($file) {
                $outputFile = str_replace("src/frontend", "public", $file);
                $outputFile = str_replace(".less", ".css", $outputFile);
                $result = $shell->executeCommand('lessc', array(
                    $file,
                    $outputFile,
                    "--verbose"
                ));
                echo $c($outputFile)
                    ->yellow()->bold() . PHP_EOL;
                echo $c("CSS built.")
                    ->green()->bold() . PHP_EOL;
            }
        }
    }
    // objects
    if($cmd['layout']) {
        echo $c("Layout")
            ->white()->bold()->highlight('blue') . PHP_EOL;
        $layout = Yaml::parse(file_get_contents(APPLICATION_PATH . "configs/layout.yml"));

        $less = '
.object {
    position: absolute;
}
.img-round-corners {
    border-top-left-radius: 2em;
    border-bottom-right-radius: 2em;
}
.scrollfix {
    overflow-y: scroll;
    overflow-x: hidden;
}'. PHP_EOL;
        $output = [];

        if(is_array($layout['objects'])){
            foreach($layout['objects'] as $object){
                $def = '#'. $object['id'];
                $output[] = defToCss($object, $def);
            }
        }

        if(is_array($layout['classes'])){
            foreach($layout['classes'] as $object){
                $def = $object['name'];
                $output[] = defToCss($object, $def);
            }
        }

        $less .= implode(null, $output);
        echo $less;
        file_put_contents(APPLICATION_PATH . 'src/frontend/css/objects.less', $less);
    }

    echo $c("Done.")
        ->green()->bold() . PHP_EOL;
