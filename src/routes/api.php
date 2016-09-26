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
