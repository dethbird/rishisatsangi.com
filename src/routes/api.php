<?php

# api
$app->post('/api/login', function () use ($app) {

    $configs = $app->container->get('configs');

    $apiClient = new StorystationApiClient(
        $configs['storystation_api']['hostname']);

    $response = $apiClient->login(
        $app->request->params('username'),
        $app->request->params('password')
    );

    if($response->getStatusCode()!==200) {
        $app->halt($response->getStatusCode());
    } else {
        $app->response->setStatus(200);
        $app->response->headers->set('Content-Type', 'application/json');

        $body = $response->getBody()->getContents();
        $model = json_decode($body);

        $_SESSION['securityContext'] = $model;

        if (isset($_SESSION['redirectTo'])) {
            $model->redirectTo = $_SESSION['redirectTo'];
        } else {
            $model->redirectTo = '/';
        }

        $app->response->setBody(json_encode($model));
    }

});

$app->group('/api', $authorize($app), function () use ($app) {

    # get projects
    $app->get('/projects', function () use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];

        $apiClient = new StorystationApiClient(
            $configs['storystation_api']['hostname'],
            $securityContext->auth_token);

        $response = $apiClient->getProjects();

        if($response->getStatusCode()!==200) {
            $app->halt($response->getStatusCode());
        } else {
            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');

            $body = $response->getBody()->getContents();
            $app->response->setBody($body);
        }

    });
});
