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
        $app->response->setBody(json_encode($body));
    }

});

$app->group('/api', $authorize($app), function () use ($app) {

    # update script
    $app->put('/script/:id', function ($id) use ($app) {

        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');
        $scriptService = new Scripts($db, $configs, $securityContext);
        $id = (int) $id;

        # validate
        $validator = new Validator();
        $validation_response = $validator->validate(
            (object) $app->request->params(),
            APPLICATION_PATH . "configs/validation_schemas/script.json");

        if (is_array($validation_response)) {
            $app->response->setStatus(400);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($validation_response));
        } else {

            $script = $scriptService->update($id, $app->request->params());

            $app->response->setStatus(200);
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode($script));
        }

    });
});
