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
require_once APPLICATION_PATH . 'src/library/Connector/StorystationApiClient.php';

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

$app->container->set('configs', $configs);


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


# 404
$app->notFound(function () use ($app) {
    $_SESSION['lastRequestUri'] = $_SERVER['REQUEST_URI'];
    $app->redirect("/");
});


# index
$app->get("/", function () use ($app) {


    if (!isset($_SESSION['securityContext'])) {
      $app->redirect("http://rishisatsangi.com");
    }

    $templateVars = [
      'securityContext' => $_SESSION['securityContext'],
      'lastRequestUri' => $_SESSION['lastRequestUri']
    ];

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
  $_SESSION['securityContext'] = null;
  $app->redirect("/");
});


# api routes
require_once APPLICATION_PATH . 'src/routes/api.php';

$app->run();
