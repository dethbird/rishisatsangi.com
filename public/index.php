<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
// ini_set('display_startup_errors',1);
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
require_once APPLICATION_PATH . 'src/library/ExternalData/InstagramData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/PocketData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/YoutubeData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/WordpressData.php';
require_once APPLICATION_PATH . 'src/library/View/Extension/TemplateHelpers.php';

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
// $view->addExtension(new MarkdownExtension($markdownEngine));
$app->container->set('configs', $configs);

// Route authentication
$authenticate = function ($app) {
    // @todo does logged in user have access to this project?
    return function () use ($app) {

        // store current path in session for smart login
        $_SESSION['redirectTo'] = $app->request->getPathInfo();

        // check cookie for securityContext
        $securityContext = json_decode($app->getCookie('securityContext'));
        // die(var_dump($securityContext));
        if (!isset($securityContext->login)) {
          $app->redirect("/login");
        }

        // Check access to project
        $pathinfo = explode("/", $app->request->getPathInfo());
        if($pathinfo[1]=="projects") {
          $projectName = $pathinfo[2];
          if($projectName) {
            if(!in_array($projectName, $securityContext->projects)) {
              $app->redirect("/projects");
            }
          }
        }


    };
};


$app->notFound(function () use ($app) {
    $app->render(
        'pages/404.html.twig'
    );
});

$app->get("/login", function () use ($app) {
  // die(var_dump($_SESSION));
  $app->render(
      'pages/login.html.twig',
      array()
  );
});
$app->post("/login", function () use ($app) {

  $app->response->headers->set('Content-Type', 'application/json');
  $users = Yaml::parse(file_get_contents("../configs/users.yml"));
  $_user = null;
  foreach($users as $user) {
    if(
      $app->request->params('username')==$user['login']
      && $app->request->params('password')==$user['password']
    ) {
      unset($user['password']);
      $user['redirectTo'] = $_SESSION['redirectTo'];
      $_user = $user;
      break;
    }
  }
  if(is_null($_user)){
    $app->halt(404);
  } else {
    $app->setCookie(
        "securityContext",
        json_encode($_user),
        "1 days"
    );
    $app->response->setBody(json_encode($_user));
  }
});

$app->get("/logout", function () use ($app) {
  $app->deleteCookie('securityContext');
  $app->redirect("/");
});

$app->get("/", function () use ($app) {
    $configs = $app->container->get('configs');
    $instagramData = new InstagramData($configs['instagram']['client_id']);
    $pocketData = new PocketData($configs['pocket']['consumer_key'], $configs['pocket']['access_token']);
    // $wordpressData = new WordpressData($configs['wordpress']['url']);
    $projects = Yaml::parse(file_get_contents("../configs/projects.yml"));
    $comics = Yaml::parse(file_get_contents("../configs/comics.yml"));
    $gallery = Yaml::parse(file_get_contents("../configs/gallery.yml"));
    $profile_photos = Yaml::parse(file_get_contents("../configs/profile_photos.yml"));

    $templateVars = array(
        "configs" => $configs,
        "section" => "index",
        "instagram_posts" => $instagramData->getRecentMedia($configs['instagram']['user_id'], 16, array(
            "art",
            "drawing",
            "sketchbook",
            "characterdesign"
        )),
        "pocket_articles" => $pocketData->getArticles(10, 3600),
        // "wordpress_posts" => $wordpressData->getPosts($configs['wordpress']['posts']),
        "wordpress_posts" => array(),
        "projects" => $projects,
        "comics" => $comics,
        "gallery" => $gallery,
        "profile_photo" => $profile_photos[rand(0,sizeof($profile_photos)-1)]
    );
    $app->render(
        'pages/index.html.twig',
        $templateVars,
        200
    );
});

$app->get("/articles", function () use ($app) {
    $configs = $app->container->get('configs');
    $pocketData = new PocketData($configs['pocket']['consumer_key'], $configs['pocket']['access_token']);
    $templateVars = array(
        "configs" => $configs,
        "section" => "articles",
        "pocket_articles" => $pocketData->getArticles(40, 3600)
    );
    $app->render(
        'pages/articles.html.twig',
        $templateVars,
        200
    );
});

$app->get("/comics", function () use ($app) {
    $configs = $app->container->get('configs');
    $comics = Yaml::parse(file_get_contents("../configs/comics.yml"));
    $templateVars = array(
        "configs" => $configs,
        "section" => "comics",
        "comics" => $comics
    );
    $app->render(
        'pages/comics.html.twig',
        $templateVars,
        200
    );
});

$app->get("/comics/:comic_name", function ($comic_name) use ($app) {
    $configs = $app->container->get('configs');
    $comics = Yaml::parse(file_get_contents("../configs/comics.yml"));
    $templateVars = array(
        "configs" => $configs,
        "section" => "comics",
        "comic" => $comics[$comic_name]
    );
    $app->render(
        'pages/comic.html.twig',
        $templateVars,
        200
    );
});


$app->get("/gallery", function () use ($app) {
    $configs = $app->container->get('configs');
    $gallery = Yaml::parse(file_get_contents("../configs/gallery.yml"));
    $templateVars = array(
        "configs" => $configs,
        "section" => "gallery",
        "gallery" => $gallery
    );
    $app->render(
        'pages/gallery.html.twig',
        $templateVars,
        200
    );
});


$app->get("/gallery/:slug", function ($slug) use ($app) {
    $configs = $app->container->get('configs');
    $gallery = Yaml::parse(file_get_contents("../configs/gallery.yml"));
    $slugify = new Slugify();
    $content = null;
    foreach ($gallery['content'] as $content) {
        if ($slugify->slugify($content['title']) == $slug) {
            break;
        }
    }
    $templateVars = array(
        "configs" => $configs,
        "section" => "gallery",
        "content" => $content
    );
    $app->render(
        'pages/gallery_content.html.twig',
        $templateVars,
        200
    );
});

$app->get("/projects", function () use ($app) {
    $configs = $app->container->get('configs');
    $projects = Yaml::parse(file_get_contents("../configs/projects.yml"));
    $templateVars = array(
        "configs" => $configs,
        "section" => "projects",
        "projects" => $projects
    );
    $app->render(
        'pages/projects.html.twig',
        $templateVars,
        200
    );
});

/** OAUTH */
$app->get("/authorize/pocket", function () use ($app) {
    $configs = $app->container->get('configs');
    $client = new Client('https://getpocket.com');
    $response = $client->post(
      '/v3/oauth/request',
      array(
        'X-Accept' => 'application/json'
      ),
      array(
        'consumer_key' => $configs['pocket']['consumer_key'],
        'redirect_uri' => 'http://'.$_SERVER['HTTP_HOST'].'/redirect/pocket'
      )
    )->send();
    $resp = json_decode($response->getBody(true));
    $_SESSION['pocket_request_code'] = $resp->code;
    $app->redirect('https://getpocket.com/auth/authorize?request_token='.$resp->code.'&redirect_uri=http://'.$_SERVER['HTTP_HOST'].'/redirect/pocket');
});
$app->get("/redirect/pocket", function () use ($app) {
  $configs = $app->container->get('configs');
  $client = new Client('https://getpocket.com');
  $response = $client->post(
    '/v3/oauth/authorize',
    array(
      'X-Accept' => 'application/json'
    ),
    array(
      'consumer_key' => $configs['pocket']['consumer_key'],
      'code' => $_SESSION['pocket_request_code']
    )
  )->send();
  $app->response->headers->set('Content-Type', 'application/json');
  echo $response->getBody(true);
});

$app->run();
