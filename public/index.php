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
require_once APPLICATION_PATH . 'src/library/ExternalData/GoogleData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/InstagramData.php';
require_once APPLICATION_PATH . 'src/library/ExternalData/PocketData.php';
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

# api
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
                    $result[0]['redirectTo'] = '/likedrop';
                }
                $app->response->setBody(json_encode($result[0]));
            }
        }
    });

    # create
    $app->post('/project', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/post_project.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $project = $projectService->create($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($project));
        }

    });


    # update
    $app->put('/project/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/post_project.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {

            $project = $projectService->update($id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($project));
        }

    });

    # add project user
    $app->post('/project_user', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_user.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $user = $projectService->addProjectUser($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($user));
        }

    });

    # create character
    $app->post('/project_character', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_character.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $character = $projectService->createProjectCharacter($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($character));
        }

    });

    # update character
    $app->put('/project_character/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_character.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $character = $projectService->updateProjectCharacter(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($character));
        }

    });

    # order characters
	$app->post('/project_character_order', function () use ($app) {

		$configs = $app->container->get('configs');
		$securityContext = json_decode($app->getCookie('securityContext'));
		$db = $app->container->get('db');
		$projectService = new Projects($db, $configs, $securityContext);

		$result = $projectService->orderProjectCharacters($app->request->params());

		$app->response->setStatus(200);
		$app->response->headers->set('Content-Type', 'application/json');
		$app->response->setBody(json_encode($result));
	});


    # create character revision
    $app->post('/project_character_revision', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_character_revision.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $revision = $projectService->createProjectCharacterRevision($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($revision));
        }

    });


    # update character revision
    $app->put('/project_character_revision/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_character_revision.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $character = $projectService->updateProjectCharacterRevision(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($character));
        }

    });

    # create concept_art
    $app->post('/project_concept_art', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_concept_art.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $concept_art = $projectService->createProjectConceptArt($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($concept_art));
        }

    });

    # update concept art
    $app->put('/project_concept_art/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_concept_art.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $concept_art = $projectService->updateProjectConceptArt(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($concept_art));
        }

    });

    # order concept art
    $app->post('/project_concept_art_order', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $result = $projectService->orderProjectConceptArt($app->request->params());

        $app->response->setStatus(200);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($result));
    });

    # create concept art revision
    $app->post('/project_concept_art_revision', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_concept_art_revision.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $result = $projectService->createProjectConceptArtRevision($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($result));
        }

    });

    # update concept art revision
    $app->put('/project_concept_art_revision/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_concept_art_revision.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $result = $projectService->updateProjectConceptArtRevision(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($result));
        }

    });

    # create location
    $app->post('/project_location', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_location.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $location = $projectService->createProjectLocation($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($location));
        }

    });

    # update location
    $app->put('/project_location/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_location.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $location = $projectService->updateProjectLocation(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($location));
        }

    });

    # create reference image
    $app->post('/project_reference_image', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_reference_image.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $reference_image = $projectService->createProjectReferenceImage($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($reference_image));
        }

    });

    # update reference image
    $app->put('/project_reference_image/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_reference_image.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $reference_image = $projectService->updateProjectReferenceImage(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($reference_image));
        }

    });

    # order reference image
    $app->post('/project_reference_image_order', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $result = $projectService->orderProjectReferenceImages($app->request->params());

        $app->response->setStatus(200);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($result));
    });

    # create storyboard
    $app->post('/project_storyboard', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_storyboard.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $storyboard = $projectService->createProjectStoryboard($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($storyboard));
        }

    });

    # update storyboard
    $app->put('/project_storyboard/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_storyboard.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $storyboard = $projectService->updateProjectStoryboard(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($storyboard));
        }

    });


	# order storyboards
	$app->post('/project_storyboard_order', function () use ($app) {

		$configs = $app->container->get('configs');
		$securityContext = json_decode($app->getCookie('securityContext'));
		$db = $app->container->get('db');
		$projectService = new Projects($db, $configs, $securityContext);

		$result = $projectService->orderProjectStoryboards($app->request->params());

		$app->response->setStatus(200);
		$app->response->headers->set('Content-Type', 'application/json');
		$app->response->setBody(json_encode($result));
	});

    # create panel
    $app->post('/project_storyboard_panel', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_storyboard_panel.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $panel = $projectService->createProjectStoryboardPanel($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($panel));
        }

    });

    # update panel
    $app->put('/project_storyboard_panel/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_storyboard_panel.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $panel = $projectService->updateProjectStoryboardPanel(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($panel));
        }

    });

	# order storyboards
	$app->post('/project_storyboard_panel_order', function () use ($app) {

		$configs = $app->container->get('configs');
		$securityContext = json_decode($app->getCookie('securityContext'));
		$db = $app->container->get('db');
		$projectService = new Projects($db, $configs, $securityContext);

		$result = $projectService->orderProjectStoryboardPanels($app->request->params());

		$app->response->setStatus(200);
		$app->response->headers->set('Content-Type', 'application/json');
		$app->response->setBody(json_encode($result));
	});

	# create revision
    $app->post('/project_storyboard_panel_revision', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_storyboard_panel_revision.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $revision = $projectService->createProjectStoryboardPanelRevision($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($revision));
        }

    });

    # update revision
    $app->put('/project_storyboard_panel_revision/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_storyboard_panel_revision.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $revision = $projectService->updateProjectStoryboardPanelRevision(
                $id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($revision));
        }

    });

    # create panel comment
    $app->post('/project_storyboard_panel_comment', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_storyboard_panel_comment.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $comment = $projectService->createProjectStoryboardPanelComment($app->request->params());

            $app->response->setStatus(201);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($comment));
        }

    });

    # update panel comment
    $app->put('/project_storyboard_panel_comment/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/project_storyboard_panel_comment.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {
            $comment = $projectService->updateProjectStoryboardPanelComment($id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($comment));
        }

    });
});

# likedrop
$app->group("/likedrop", $authorize($app), function () use ($app) {

    $app->get('/gdrive', function () use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');

        $gdrive_user = $db->fetchOne(
            $configs['sql']['account_gdrive']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        if ($gdrive_user) {
            $gdrive_files = $db->fetchAll(
                $configs['sql']['content_gdrive_files']['get_by_account_gdrive_id'],[
                    'limit' => 50,
                    'account_gdrive_id' => $gdrive_user['id']]);
        }

        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
            'gdrive_user' => $gdrive_user,
            'gdrive_files' => $gdrive_files,
            "section" => "likedrop.gdrive",
            'hostname' => $configs['server']['hostname']
        );

        $app->render(
            'pages/likedrop/gdrive.html.twig',
            $templateVars,
            200
        );
    });

    $app->get('/pocket', function () use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');

        $pocket_user = $db->fetchOne(
            $configs['sql']['account_pocket']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        if ($pocket_user) {
            $pocket_articles = $db->fetchAll(
                $configs['sql']['content_pocket']['get_by_account_pocket_id'],[
                    'limit' => 50,
                    'account_pocket_id' => $pocket_user['id']]);
        }

        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
                'pocket_user' => $pocket_user,
                'pocket_articles' => $pocket_articles,
            "section" => "likedrop.pocket",
            'hostname' => $configs['server']['hostname']
        );

        $app->render(
            'pages/likedrop/pocket.html.twig',
            $templateVars,
            200
        );
    });

    $app->get('/youtube', function () use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');

        $gdrive_user = $db->fetchOne(
            $configs['sql']['account_gdrive']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        if ($gdrive_user) {

            $youtube_watchlater_videos = $db->fetchAll(
                $configs['sql']['content_youtube']['get_by_account_gdrive_id'],[
                    'limit' => 50,
                    'account_gdrive_id' => $gdrive_user['id']]);
        }

        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
            'gdrive_user' => $gdrive_user,
            'youtube_watchlater_videos' => $youtube_watchlater_videos,
            "section" => "likedrop.youtube",
            'hostname' => $configs['server']['hostname']
        );

        $app->render(
            'pages/likedrop/youtube.html.twig',
            $templateVars,
            200
        );
    });
});

# project
$app->group('/project', $authorize($app), function () use ($app) {

    # storyboard panel comment
    $app->get("/:id/storyboard/:storyboard_id/panel/:panel_id/comment/:comment_id", function (
            $id, $storyboard_id, $panel_id, $comment_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {
            $users = $projectService->fetchProjectUsers($project['id']);
            $storyboard = $projectService->fetchStoryboardById($storyboard_id);
            if($storyboard) {
                $panel = $projectService->fetchStoryboardPanelById($panel_id);
                if ($panel) {

                    $comment = $projectService->fetchStoryboardPanelCommentById($comment_id);

                    $templateVars = array(
                        "configs" => $configs,
                        'securityContext' => $securityContext,
                        "section" => "project.storyboard.panel.comment.index",
                        "project" => $project,
                        "users" => $users,
                        "storyboard" => $storyboard,
                        "panel" => $panel,
                        "comment" => $comment
                    );

                    $app->render(
                        'pages/project/storyboard_panel_comment.html.twig',
                        $templateVars,
                        200
                    );
                }
            }
        }
    });

	# storyboard panel revision
    $app->get("/:id/storyboard/:storyboard_id/panel/:panel_id/revision/:revision_id", function (
            $id, $storyboard_id, $panel_id, $revision_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {
            $storyboard = $projectService->fetchStoryboardById($storyboard_id);
            if($storyboard) {
                $panel = $projectService->fetchStoryboardPanelById($panel_id);
				if ($panel) {

					$revision = $projectService->fetchStoryboardPanelRevisionById($revision_id);

	                $templateVars = array(
	                    "configs" => $configs,
	                    'securityContext' => $securityContext,
	                    "section" => "project.storyboard.panel.revision.index",
	                    "project" => $project,
	                    "storyboard" => $storyboard,
	                    "panel" => $panel,
	                    "revision" => $revision
	                );

	                $app->render(
	                    'pages/project/storyboard_panel_revision.html.twig',
	                    $templateVars,
	                    200
	                );
				}
            }
        }
    });


    # storyboard panel
    $app->get("/:id/storyboard/:storyboard_id/panel/:panel_id", function (
            $id, $storyboard_id, $panel_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {
            $storyboard = $projectService->fetchStoryboardById($storyboard_id);
            if($storyboard) {
                $panel = $projectService->fetchStoryboardPanelById($panel_id);

                $templateVars = array(
                    "configs" => $configs,
                    'securityContext' => $securityContext,
                    "section" => "project.storyboard.panel.index",
                    "project" => $project,
                    "storyboard" => $storyboard,
                    "panel" => $panel
                );

                $app->render(
                    'pages/project/storyboard_panel.html.twig',
                    $templateVars,
                    200
                );
            }
        }
    });

    # storyboard
    $app->get("/:id/storyboard/:storyboard_id", function (
            $id, $storyboard_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {

            $storyboard = $projectService->fetchStoryboardById($storyboard_id);

            $templateVars = array(
                "configs" => $configs,
                'securityContext' => $securityContext,
                "section" => "project.storyboard.index",
                "project" => $project,
                "storyboard" => $storyboard
            );

            $app->render(
                'pages/project/storyboard.html.twig',
                $templateVars,
                200
            );
        }
    });

    # location
    $app->get("/:id/location/:location_id", function (
            $id, $location_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {

            $location = $projectService->fetchLocationById($location_id);

            $templateVars = array(
                "configs" => $configs,
                'securityContext' => $securityContext,
                "section" => "project.location.index",
                "project" => $project,
                "location" => $location
            );

            $app->render(
                'pages/project/location.html.twig',
                $templateVars,
                200
            );
        }
    });

    # reference_image
    $app->get("/:id/reference_image/:reference_image_id", function (
            $id, $reference_image_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {

            $reference_image = $projectService->fetchReferenceImageById($reference_image_id);

            $templateVars = array(
                "configs" => $configs,
                'securityContext' => $securityContext,
                "section" => "project.reference_image.index",
                "project" => $project,
                "reference_image" => $reference_image
            );

            $app->render(
                'pages/project/reference_image.html.twig',
                $templateVars,
                200
            );
        }
    });

    # concept art revision
    $app->get("/:id/concept_art/:concept_art_id/revision/:revision_id", function (
            $id, $concept_art_id, $revision_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {
            $concept_art = $projectService->fetchConceptArtById($concept_art_id);
            if ($concept_art) {
                $revision = $projectService->fetchConceptArtRevisionById($revision_id);

                $templateVars = array(
                    "configs" => $configs,
                    'securityContext' => $securityContext,
                    "section" => "project.concept_art.revision.index",
                    "project" => $project,
                    "concept_art" => $concept_art,
                    "revision" => $revision
                );

                $app->render(
                    'pages/project/concept_art_revision.html.twig',
                    $templateVars,
                    200
                );
            }
        }
    });

    # concept_art
    $app->get("/:id/concept_art/:concept_art_id", function (
            $id, $concept_art_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {

            $concept_art = $projectService->fetchConceptArtById($concept_art_id);

            $templateVars = array(
                "configs" => $configs,
                'securityContext' => $securityContext,
                "section" => "project.concept_art.index",
                "project" => $project,
                "concept_art" => $concept_art
            );

            $app->render(
                'pages/project/concept_art.html.twig',
                $templateVars,
                200
            );
        }
    });

    # character revision
    $app->get("/:id/character/:character_id/revision/:revision_id", function (
            $id, $character_id, $revision_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {
            $character = $projectService->fetchCharacterById($character_id);
			if ($character) {
				$revision = $projectService->fetchCharacterRevisionById($revision_id);

                $templateVars = array(
                    "configs" => $configs,
                    'securityContext' => $securityContext,
                    "section" => "project.character.revision.index",
                    "project" => $project,
                    "character" => $character,
                    "revision" => $revision
                );

                $app->render(
                    'pages/project/character_revision.html.twig',
                    $templateVars,
                    200
                );
			}
        }
    });

    # character
    $app->get("/:id/character/:character_id", function (
            $id, $character_id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {

            $character = $projectService->fetchCharacterById($character_id);

            $templateVars = array(
                "configs" => $configs,
                'securityContext' => $securityContext,
                "section" => "project.character.index",
                "project" => $project,
                "character" => $character
            );

            $app->render(
                'pages/project/character.html.twig',
                $templateVars,
                200
            );
        }
    });

    # character
    $app->get("/:id/user/add", function (
            $id) use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $project = $projectService->fetchOne($id);
        if ($project) {

            $templateVars = array(
                "configs" => $configs,
                'securityContext' => $securityContext,
                "section" => "project.character.index",
                "project" => $project,
            );

            $app->render(
                'pages/project/user.html.twig',
                $templateVars,
                200
            );
        }
    });

    # project detail
    $app->get("/:id/detail", function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        $project = [];
        if($id > 0) {
            $project = $projectService->fetchOne($id);
            $project = $projectService->hydrateProject($project);
        }

        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
            "section" => "project.detail",
            "project" => $project
        );

        $app->render(
            'pages/project_detail.html.twig',
            $templateVars,
            200
        );
    });

    # project
    $app->get("/:id", function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = json_decode($app->getCookie('securityContext'));
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        $project = [];
        if($id > 0) {
            $project = $projectService->fetchOne($id);
            $project = $projectService->hydrateProject($project);
        }

        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
            "section" => "project.index",
            "project" => $project
        );

        $app->render(
            'pages/project.html.twig',
            $templateVars,
            200
        );
    });
});

# projects
$app->get("/projects", $authorize($app), function () use ($app) {


    $configs = $app->container->get('configs');
    $securityContext = json_decode($app->getCookie('securityContext'));
    $db = $app->container->get('db');
    $projectService = new Projects($db, $configs, $securityContext);

    $projects = $projectService->getProjects();

    foreach ($projects as $i=>$project) {
        $projects[$i] = $projectService->hydrateProject($project);
    }

	// print_r($projects); exit();

    $templateVars = array(
        "configs" => $configs,
        'securityContext' => $securityContext,
        "section" => "projects.index",
        "projects" => $projects
    );

    $app->render(
        'pages/projects.html.twig',
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


# service
$app->group('/service', function () use ($app) {

    $app->group('/gdrive', function () use ($app) {

        $app->get('/authorize', function () use ($app) {
            $configs = $app->container->get('configs');
            $googleData = new GoogleData(
                "LikeDrop",
                APPLICATION_PATH . "configs/" . $configs['service']['gdrive']['client_json_config_filename']);
            $app->redirect($googleData->createAuthUrl());
        });

        $app->get('/redirect', function () use ($app) {
            $configs = $app->container->get('configs');
            $db = $app->container->get('db');
            $securityContext = json_decode($app->getCookie('securityContext'));

            $googleData = new GoogleData(
                "LikeDrop",
                APPLICATION_PATH . "configs/" . $configs['service']['gdrive']['client_json_config_filename']);

            $accessTokenData = $googleData->getAccessToken(
                $app->request->params('code'));

            $result = $db->perform(
                $configs['sql']['account_gdrive']['insert_update_gdrive_user'],
                [
                    'user_id' => $securityContext->id,
                    'access_token' => json_encode($accessTokenData),
                    'refresh_token' => $accessTokenData['refresh_token']
                ]
            );
            $app->redirect('/likedrop');
        });

        $app->get('/thumbnail/:cache_key', function ($cache_key) use ($app) {
            $configs = $app->container->get('configs');
            $file = APPLICATION_PATH .
            $configs['service']['gdrive']['thumbnail_cache_folder'] . "/" . $cache_key;
            $mimeType =  mime_content_type($file);
            if ($mimeType == "image/vnd.adobe.photoshop") {
                $mimeType = "image/jpeg";
            }
            // echo $mimeType; exit();
            header('Content-Type: ' .$mimeType);
            header('Content-Length: ' . filesize($file));
            readfile($file);
            exit();
        });
    });

    $app->group('/instagram', function () use ($app) {

        $app->get('/authorize', function () use ($app) {
            $configs = $app->container->get('configs');
            $instagramData = new InstagramData(
                $configs['service']['instagram']['client_id'],
                $configs['service']['instagram']['client_secret']);

            $app->redirect($instagramData->createAuthUrl(
                "http://".$_SERVER['HTTP_HOST']."/service/instagram/redirect"));
        });

        $app->get('/redirect', function () use ($app) {
            $configs = $app->container->get('configs');
            $db = $app->container->get('db');
            $securityContext = json_decode($app->getCookie('securityContext'));
            $instagramData = new InstagramData(
                $configs['service']['instagram']['client_id'],
                $configs['service']['instagram']['client_secret']);

            $accessTokenData = $instagramData->getAuthTokenFromCode(
                "http://".$_SERVER['HTTP_HOST']."/service/instagram/redirect",
                $app->request->params('code')
            );

            $result = $db->perform(
                $configs['sql']['account_instagram']['insert_update_instagram_user'],
                [
                    'user_id' => $securityContext->id,
                    'access_token' => json_encode($accessTokenData)
                ]
            );
            $app->redirect('/likedrop');
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
            $app->redirect('/likedrop');
        });
    });
});


$app->run();
