<?php

# likedrop
$app->group("/likedrop", $authorize($app), function () use ($app) {

    $app->get('/', function () use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');

        $gdrive_user = $db->fetchOne(
            $configs['sql']['account_gdrive']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        $pocket_user = $db->fetchOne(
            $configs['sql']['account_pocket']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        $spotify_user = $db->fetchOne(
            $configs['sql']['account_spotify']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        $vimeo_user = $db->fetchOne(
            $configs['sql']['account_vimeo']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
            'gdrive_user' => $gdrive_user,
            'pocket_user' => $pocket_user,
            'spotify_user' => $spotify_user,
            'vimeo_user' => $vimeo_user,
            "section" => "likedrop.gdrive",
            'hostname' => $configs['server']['hostname']
        );

        $app->render(
            'pages/likedrop.html.twig',
            $templateVars,
            200
        );
    });

    $app->get('/gdrive', function () use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');

        $gdrive_user = $db->fetchOne(
            $configs['sql']['account_gdrive']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        if ($gdrive_user) {
            $gdrive_files = $db->fetchAll(
                $configs['sql']['content_gdrive_files']['get_by_account_gdrive_id'],[
                    'limit' => 250,
                    'account_gdrive_id' => $gdrive_user['id']]);
        } else {
            $app->redirect('/likedrop');
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
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');

        $pocket_user = $db->fetchOne(
            $configs['sql']['account_pocket']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        if ($pocket_user) {
            $pocket_articles = $db->fetchAll(
                $configs['sql']['content_pocket']['get_by_account_pocket_id'],[
                    'limit' => 250,
                    'account_pocket_id' => $pocket_user['id']]);
        } else {
            $app->redirect('/likedrop');
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

    $app->get('/spotify', function () use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');

        $spotify_user = $db->fetchOne(
            $configs['sql']['account_spotify']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        if ($spotify_user) {
            $spotify_tracks = $db->fetchAll(
                $configs['sql']['content_spotify']['get_by_account_spotify_id'],[
                    'limit' => 250,
                    'account_spotify_id' => $spotify_user['id']]);
        } else {
            $app->redirect('/likedrop');
        }


        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
                'spotify_user' => $spotify_user,
                'spotify_tracks' => $spotify_tracks,
            "section" => "likedrop.spotify",
            'hostname' => $configs['server']['hostname']
        );

        $app->render(
            'pages/likedrop/spotify.html.twig',
            $templateVars,
            200
        );
    });

    $app->get('/youtube', function () use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');

        $gdrive_user = $db->fetchOne(
            $configs['sql']['account_gdrive']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        if ($gdrive_user) {

            $youtube_watchlater_videos = $db->fetchAll(
                $configs['sql']['content_youtube']['get_by_account_gdrive_id'],[
                    'limit' => 100,
                    'account_gdrive_id' => $gdrive_user['id']]);
        } else {
            $app->redirect('/likedrop');
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

    $app->get('/vimeo', function () use ($app) {
        $configs = $app->container->get('configs');
        $securityContext = $_SESSION['securityContext'];
        $db = $app->container->get('db');

        $vimeo_user = $db->fetchOne(
            $configs['sql']['account_vimeo']['get_by_user_id'],[
                'user_id' => $securityContext->id]);

        if ($vimeo_user) {
            $vimeo_videos = $db->fetchAll(
                $configs['sql']['content_vimeo']['get_by_account_vimeo_id'],[
                    'limit' => 100,
                    'account_vimeo_id' => $vimeo_user['id']]);
        } else {
            $app->redirect('/likedrop');
        }

        $templateVars = array(
            "configs" => $configs,
            'securityContext' => $securityContext,
            'vimeo_user' => $vimeo_user,
            'vimeo_videos' => $vimeo_videos,
            "section" => "likedrop.vimeo",
            'hostname' => $configs['server']['hostname']
        );

        $app->render(
            'pages/likedrop/vimeo.html.twig',
            $templateVars,
            200
        );
    });
});
