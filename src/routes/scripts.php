<?php


# scripts
$app->get("/scripts", $authorize($app), function () use ($app) {

    $configs = $app->container->get('configs');
    $securityContext = $_SESSION['securityContext'];
    $db = $app->container->get('db');
    $scriptsService = new Scripts($db, $configs, $securityContext);

    $scripts = $scriptsService->fetchAll();

    $templateVars = array(
        "configs" => $configs,
        'securityContext' => $securityContext,
        "section" => "scripts.index",
        "scripts" => $scripts
    );

    $app->render(
        'pages/scripts.html.twig',
        $templateVars,
        200
    );
});

# script
$app->group('/script', $authorize($app), function () use ($app) {
    # script
    $app->get("/:id", function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');
        $scriptService = new Scripts($db, $configs, $securityContext);
        $id = (int) $id;

        $script = [];
        if($id > 0) {
            $script = $scriptService->fetchOne($id);
        }

        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
            "section" => "script.index",
            "script" => $script
        );

        $app->render(
            'pages/script.html.twig',
            $templateVars,
            200
        );
    });
});
