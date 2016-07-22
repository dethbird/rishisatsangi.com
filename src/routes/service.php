<?php

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
            $securityContext = $_SESSION['securityContext'];

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


    $app->group('/flickr', function () use ($app) {

        $app->get('/authorize', function () use ($app) {
            $configs = $app->container->get('configs');

            $flickrData = new FlickrData(
                $configs['service']['flickr']['key'],
                $configs['service']['flickr']['secret'],
                "http://".$_SERVER['HTTP_HOST']."/service/flickr/redirect"
            );

            $request_token = $flickrData->getRequestToken();
            $_SESSION['flickr_request_token'] = $request_token;

            $app->redirect($flickrData->getAuthorizationUri(
                $request_token['oauth_token']));

        });

        $app->get('/redirect', function () use ($app) {

            $configs = $app->container->get('configs');
            $db = $app->container->get('db');
            $securityContext = $_SESSION['securityContext'];

            $flickrData = new FlickrData(
                $configs['service']['flickr']['key'],
                $configs['service']['flickr']['secret'],
                "http://".$_SERVER['HTTP_HOST']."/service/flickr/redirect"
            );

            $flickrData->setRequestToken(
                $_SESSION['flickr_request_token']['oauth_token'],
                $_SESSION['flickr_request_token']['oauth_token_secret']);

            $token = $flickrData->getAccessToken(
                $app->request->params('oauth_token'),
                $app->request->params('oauth_verifier'));

            $result = $db->perform(
                $configs['sql']['account_flickr']['insert_update'],
                [
                    'user_id' => $securityContext->id,
                    'flickr_user_id' => $token['user_nsid'],
                    'access_token' => $token['oauth_token'],
                    'access_token_secret' => $token['oauth_token_secret']
                ]
            );
            $app->redirect('/likedrop');
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
            $securityContext = $_SESSION['securityContext'];
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
            $securityContext = $_SESSION['securityContext'];
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

    $app->group('/spotify', function () use ($app) {

        $app->get('/authorize', function () use ($app) {
            $configs = $app->container->get('configs');
            $session = new SpotifyWebAPI\Session(
                $configs['service']['spotify']['client_id'],
                $configs['service']['spotify']['client_secret'],
                "http://".$_SERVER['HTTP_HOST']."/service/spotify/redirect");
            $scopes = array(
                'playlist-read-private',
                'user-read-private',
                'user-library-read'
            );
            $authorizeUrl = $session->getAuthorizeUrl(array(
                'scope' => $scopes
            ));
            $app->redirect($authorizeUrl);

        });

        $app->get('/redirect', function () use ($app) {
            $configs = $app->container->get('configs');
            $db = $app->container->get('db');
            $securityContext = $_SESSION['securityContext'];
            $session = new SpotifyWebAPI\Session(
                $configs['service']['spotify']['client_id'],
                $configs['service']['spotify']['client_secret'],
                "http://".$_SERVER['HTTP_HOST']."/service/spotify/redirect");
            $api = new SpotifyWebAPI\SpotifyWebAPI();

            $session->requestAccessToken($app->request->params('code'));
            $accessToken = $session->getAccessToken();
            $refreshToken = $session->getRefreshToken();

            $result = $db->perform(
                $configs['sql']['account_spotify']['insert_update'],
                [
                    'user_id' => $securityContext->id,
                    'access_token' => $accessToken,
                    'refresh_token' => $refreshToken
                ]
            );
            $app->redirect('/likedrop');
        });
    });

    $app->group('/vimeo', function () use ($app) {

        $app->get('/authorize', function () use ($app) {
            $configs = $app->container->get('configs');
            $vimeoData = new VimeoData(
                $configs['service']['vimeo']['client_key'],
                $configs['service']['vimeo']['client_secret']);
            $client_token = $vimeoData->fetchClientToken();

            $_SESSION['vimeoClientToken'] = $client_token;
            $app->redirect($vimeoData->getAuthorizeScreenUri(
                "farts",
                "http://".$_SERVER['HTTP_HOST']."/service/vimeo/redirect"
            ));
        });

        $app->get('/redirect', function () use ($app) {
            $configs = $app->container->get('configs');
            $db = $app->container->get('db');
            $securityContext = $_SESSION['securityContext'];
            $vimeoData = new VimeoData(
                $configs['service']['vimeo']['client_key'],
                $configs['service']['vimeo']['client_secret']);

            $accessTokenData = $vimeoData->fetchAccessTokenData(
                $app->request->params('code'),
                "http://".$_SERVER['HTTP_HOST']."/service/vimeo/redirect");

            $result = $db->perform(
                $configs['sql']['account_vimeo']['insert_update'],
                [
                    'user_id' => $securityContext->id,
                    'username' => $accessTokenData->user->name,
                    'access_token' => $accessTokenData->access_token
                ]
            );
            $app->redirect('/likedrop');
        });
    });
});
