<?php

# api
$app->post('/api/login', function () use ($app) {

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
            $_SESSION['securityContext'] = (object) $result[0];
            if (isset($_SESSION['redirectTo'])) {
                $result[0]['redirectTo'] = $_SESSION['redirectTo'];
            } else {
                $result[0]['redirectTo'] = '/likedrop';
            }
            $app->response->setBody(json_encode($result[0]));
        }
    }
});

$app->group('/api', $authorizeByHeaders($app), function () use ($app) {


    # get
    $app->get('/project/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);
        $id = (int) $id;

        $project = $projectService->fetchOne($id);
        $project = $projectService->hydrateProject($project);

        $app->response->setStatus(200);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($project));

    });

    # create
    $app->post('/project', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
		$securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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

    # order panel revision
    $app->post('/project_character_revision_order', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $result = $projectService->orderProjectCharacterRevisions($app->request->params());

        $app->response->setStatus(200);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($result));
    });


    # create concept_art
    $app->post('/project_concept_art', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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

    # order location
    $app->post('/project_location_order', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $result = $projectService->orderProjectLocations($app->request->params());

        $app->response->setStatus(200);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($result));
    });

    # create reference image
    $app->post('/project_reference_image', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
		$securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
		$securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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

    # order panel revision
    $app->post('/project_storyboard_panel_revision_order', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');
        $projectService = new Projects($db, $configs, $securityContext);

        $result = $projectService->orderProjectStoryboardPanelRevisions($app->request->params());

        $app->response->setStatus(200);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($result));
    });


    # create panel comment
    $app->post('/project_storyboard_panel_comment', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
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
        $securityContext = $_SESSION['securityContext'];
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
