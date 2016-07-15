<?php

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
