<?php

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
