<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors',1);
define("APPLICATION_PATH", __DIR__ . "/../");
date_default_timezone_set('America/New_York');
session_cache_limiter(false);
session_start();

// Ensure src/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    APPLICATION_PATH ,
    APPLICATION_PATH . 'library',
    get_include_path(),
)));


require '../vendor/autoload.php';
require_once APPLICATION_PATH . 'src/library/View/Extension/TemplateHelpers.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/GoogleDrive.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/PocketData.php';
require_once APPLICATION_PATH . 'src/library/Data/Base.php';

use Aptoma\Twig\Extension\MarkdownExtension;
use Aptoma\Twig\Extension\MarkdownEngine;
use Cocur\Slugify\Slugify;
use Symfony\Component\Yaml\Yaml;
use Guzzle\Http\Client;

// Load configs and add to the app container
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

$authorize = function ($app) {

    return function () use ($app) {

        // store current path in session for smart login
        $_SESSION['redirectTo'] = $app->request->getPathInfo();

        // check cookie for securityContext
        $securityContext = json_decode($app->getCookie('securityContext'));

        if (!isset($securityContext->username)) {
            $app->redirect("/login");
        }

    };
};

$app->notFound(function () use ($app) {
    $app->render(
        'pages/404.html.twig'
    );
});


$app->get("/logout", function () use ($app) {
  $app->deleteCookie('securityContext');
  $app->redirect("/");
});


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


$app->get("/dashboard", $authorize($app), function () use ($app) {

    $configs = $app->container->get('configs');
    $securityContext = json_decode($app->getCookie('securityContext'));
    $db = $app->container->get('db');

    // gather data
    $pocket_user = $db->fetchOne(
        $configs['sql']['account_pocket']['get_by_user_id'],[
            'user_id' => $securityContext->id]);

    if ($pocket_user) {
        $pocket_articles = $db->fetchAll(
            $configs['sql']['content_pocket']['get_by_account_pocket_id'],[
                'until' => date('Y-m-d H:i:s', time() - (60 * 60 * 24 * 7)),
                'account_pocket_id' => $pocket_user['id']]);
    }

    $gdrive_user = $db->fetchOne(
        $configs['sql']['account_gdrive']['get_by_user_id'],[
            'user_id' => $securityContext->id]);

    if ($gdrive_user) {
        $gdrive_files = $db->fetchAll(
            $configs['sql']['content_gdrive_files']['get_by_account_gdrive_id'],[
                'limit' => 25,
                'account_gdrive_id' => $gdrive_user['id']]);
    }

    $templateVars = array(
        "configs" => $configs,
        'securityContext' => $securityContext,
        'pocket_user' => $pocket_user,
        'pocket_articles' => $pocket_articles,
        'gdrive_user' => $gdrive_user,
        'gdrive_files' => $gdrive_files,
        "section" => "dashboard.index"
    );

    $app->render(
        'pages/dashboard.html.twig',
        $templateVars,
        200
    );
});


$app->get("/account", $authorize($app), function () use ($app) {

    $configs = $app->container->get('configs');

    $templateVars = array(
        "configs" => $configs,
        "section" => "account"
    );

    $app->render(
        'pages/dashboard/account.html.twig',
        $templateVars,
        200
    );
});

$app->group('/api', function () use ($app) {
    $app->post('/login', function () use ($app) {

        $configs = $app->container->get('configs');
        $db = $app->container->get('db');

        $result = $db->fetchAll(
            $configs['sql']['users']['select_by_username_and_password'],
            [
                'username' => $app->request->params('username'),
                'password' => md5($app->request->params('password'))
            ]
        );

        $app->response->setStatus(404);
        if (isset($result[0])) {
            if ($result[0]['username'] == $app->request->params('username')){
                $app->response->setStatus(200);
                $app->response->headers->set('Content-Type', 'application/json');
                $app->setCookie(
                    "securityContext",
                    json_encode($result[0]),
                    "1 days"
                );
                if (isset($_SESSION['redirectTo'])) {
                    $result[0]['redirectTo'] = $_SESSION['redirectTo'];
                } else {
                    $result[0]['redirectTo'] = '/dashboard';
                }
                $app->response->setBody(json_encode($result[0]));
            }
        }
    });
});


$app->group('/service', $authorize($app), function () use ($app) {

    $app->group('/gdrive', function () use ($app) {

        $app->get('/authorize', function () use ($app) {
            $configs = $app->container->get('configs');
            $googleDrive = new GoogleDrive(
                "LikeDrop",
                APPLICATION_PATH . "configs/" . $configs['service']['gdrive']['client_json_config_filename']);
            $app->redirect($googleDrive->createAuthUrl());
        });

        $app->get('/redirect', function () use ($app) {
            $configs = $app->container->get('configs');
            $db = $app->container->get('db');
            $securityContext = json_decode($app->getCookie('securityContext'));

            $googleDrive = new GoogleDrive(
                "LikeDrop",
                APPLICATION_PATH . "configs/" . $configs['service']['gdrive']['client_json_config_filename']);

            $accessTokenData = $googleDrive->getAccessToken(
                $app->request->params('code'));

            $result = $db->perform(
                $configs['sql']['account_gdrive']['insert_update_gdrive_user'],
                [
                    'user_id' => $securityContext->id,
                    'access_token' => json_encode($accessTokenData),
                    'refresh_token' => $accessTokenData['refresh_token']
                ]
            );
            $app->redirect('/dashboard');
        });
    });

    $app->group('/pocket', function () use ($app) {

        $app->get('/authorize', function () use ($app) {
            $configs = $app->container->get('configs');
            $pocketData = new PocketData(
                $configs['service']['pocket']['consumer_key']);
            $code = $pocketData->fetchRequestCode(
                "http://".$_SERVER['HTTP_HOST']."/service/pocket/redirect");
            $_SESSION['pocketCode'] = $code;
            $app->redirect($pocketData->getAuthorizeScreenUri(
                $code,
                "http://".$_SERVER['HTTP_HOST']."/service/pocket/redirect"
            ));
        });

        $app->get('/redirect', function () use ($app) {
            $configs = $app->container->get('configs');
            $db = $app->container->get('db');
            $securityContext = json_decode($app->getCookie('securityContext'));
            $pocketData = new PocketData(
                $configs['service']['pocket']['consumer_key']);

            $accessTokenData = $pocketData->fetchAccessTokenData(
                $_SESSION['pocketCode']);

            $result = $db->perform(
                $configs['sql']['account_pocket']['insert_update_pocket_user'],
                [
                    'user_id' => $securityContext->id,
                    'username' => $accessTokenData->username,
                    'access_token' => $accessTokenData->access_token
                ]
            );
            $app->redirect('/dashboard');
        });
    });
});


$app->run();
