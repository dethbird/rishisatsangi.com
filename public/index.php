<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors',1);
define("APPLICATION_PATH", __DIR__ . "/../");
date_default_timezone_set('America/New_York');
session_cache_limiter(false);
session_start();

# Ensure src/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    APPLICATION_PATH ,
    APPLICATION_PATH . 'library',
    get_include_path(),
)));


require '../vendor/autoload.php';
require_once APPLICATION_PATH . 'src/library/View/Extension/TemplateHelpers.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/FlickrData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/GoogleData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/InstagramData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/PocketData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/VimeoData.php';
require_once APPLICATION_PATH . 'src/library/Data/Base.php';
require_once APPLICATION_PATH . 'src/library/Logic/Projects.php';
require_once APPLICATION_PATH . 'src/library/Validation/Validator.php';

use Aptoma\Twig\Extension\MarkdownExtension;
use Aptoma\Twig\Extension\MarkdownEngine;
use Cocur\Slugify\Slugify;
use Symfony\Component\Yaml\Yaml;
use Guzzle\Http\Client;

# Load configs and add to the app container
$configs = Yaml::parse(file_get_contents("../configs/configs.yml"));
$app = new \Slim\Slim(
    array(
        'view' => new Slim\Views\Twig(),
        'templates.path' => APPLICATION_PATH . 'src/views',
        'cookies.encrypt' => true,
        'cookies.secret_key' => $configs['security']['secret'],
        'cookies.cipher' => MCRYPT_RIJNDAEL_256,
        'cookies.cipher_mode' => MCRYPT_MODE_CBC
    )
);
// $app->add(new \Slim\Middleware\SessionCookie(array(
//     'expires' => '1 day',
//     'path' => '/',
//     'domain' => $configs['server']['hostname'],
//     'secure' => true,
//     'httponly' => false,
//     'name' => 'explosioncorp_session',
//     'secret' => $configs['security']['secret']
// )));
$markdownEngine = new MarkdownEngine\MichelfMarkdownEngine();
$view = $app->view();
$view->parserExtensions = array(
    new \Slim\Views\TwigExtension(),
    new TemplateHelpers(),
    new MarkdownExtension($markdownEngine)
);
$db = new DataBase(
    $configs['mysql']['host'],
    $configs['mysql']['database'],
    $configs['mysql']['user'],
    $configs['mysql']['password']);

$app->container->set('configs', $configs);
$app->container->set('db', $db);

# authorize the user by session (middleware)
$authorize = function ($app) {

    return function () use ($app) {

        # store current path in session for smart login
        $_SESSION['redirectTo'] = $app->request->getPathInfo();

        # check cookie for securityContext
        if(!isset( $_SESSION['securityContext'])) {
            $app->redirect("/login");
        }
        $securityContext = $_SESSION['securityContext'];

        if (!isset($securityContext->username)) {
            $app->redirect("/login");
        }

    };
};

# authorize the user by header auth token
$authorizeByHeaders = function ($app) {

    return function () use ($app) {

        # check cookie for securityContext
        if (!isset($_SESSION['securityContext'])) {
            $authToken = $app->request->headers->get('Auth-Token');
            if ($authToken == "") {
                $app->halt(400);
            } else {
                $configs = $app->container->get('configs');
                $db = $app->container->get('db');
                $result = $db->fetchOne(
                    $configs['sql']['users']['get_by_auth_token'],
                    [
                        'auth_token' => $authToken
                    ]
                );
                $_SESSION['securityContext'] = (object) $result;
            }
        }
    };
};

$app->notFound(function () use ($app) {
    $app->render(
        'pages/404.html.twig'
    );
});

# index
$app->get("/", function () use ($app) {

    $configs = $app->container->get('configs');

    $templateVars = array(
        "configs" => $configs,
        "section" => "index"
    );

    $app->render(
        'pages/index.html.twig',
        $templateVars,
        200
    );
});


# login
$app->get("/login", function () use ($app) {

    $configs = $app->container->get('configs');

    $templateVars = array(
        "configs" => $configs,
        "section" => "login"
    );

    $app->render(
        'pages/login.html.twig',
        $templateVars,
        200
    );
});



# logout
$app->get("/logout", function () use ($app) {
  $app->deleteCookie('securityContext');
  $app->redirect("/");
});


require_once APPLICATION_PATH . 'src/routes/api.php';
require_once APPLICATION_PATH . 'src/routes/likedrop.php';
require_once APPLICATION_PATH . 'src/routes/projects.php';
require_once APPLICATION_PATH . 'src/routes/scripts.php';
require_once APPLICATION_PATH . 'src/routes/service.php';


$app->run();
