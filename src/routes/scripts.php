<?php


# scripts
$app->get("/scripts", $authorize($app), function () use ($app) {

    $configs = $app->container->get('configs');
    $securityContext = $_SESSION['securityContext'];
    $db = $app->container->get('db');
    $scriptsService = new Scripts($db, $configs, $securityContext);

    $sctipts = $scriptsService->getBoards();

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
