<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/Data/Base.php';
    use Colors\Color;
    use Commando\Command;
    use Symfony\Component\Yaml\Yaml;

    $c = new Color();
    $configs = Yaml::parse(
        file_get_contents(APPLICATION_PATH . "configs/configs.yml"));
    $db = new DataBase(
        $configs['mysql']['host'],
        $configs['mysql']['database'],
        $configs['mysql']['user'],
        $configs['mysql']['password']);

    $cmd = new Command();
    $cmd->beepOnError();
    $cmd->flag('p')
        ->boolean()
        ->aka('pull')
        ->describedAs('Pull the saved tracks from Spotify');
    $cmd->flag('r')
        ->boolean()
        ->aka('refresh')
        ->describedAs('Refresh the Spotify token');



    $spotify_users = $db->fetchAll(
        $configs['sql']['account_spotify']['get_all'],[]);
    $session = new SpotifyWebAPI\Session(
        $configs['service']['spotify']['client_id'],
        $configs['service']['spotify']['client_secret'],
        "http://".$_SERVER['HTTP_HOST']."/service/spotify/redirect");
    $api = new SpotifyWebAPI\SpotifyWebAPI();

    if ($cmd['pull']) {

        echo $c(
"   ___       _ _
  / _ \_   _| | |
 / /_)/ | | | | |
/ ___/| |_| | | |
\/     \__,_|_|_|
                 "
            )
            ->white()->bold()->highlight('blue') . PHP_EOL;

        echo $c('yank dem tracks')
            ->yellow()->bold() . PHP_EOL;

        foreach ($spotify_users as $spotify_user) {
            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $spotify_user['user_id']]);

            $session->refreshAccessToken($spotify_user['refresh_token']);
            $accessToken = $session->getAccessToken();
            $result = $db->perform(
                $configs['sql']['account_spotify']['insert_update'],
                [
                    'user_id' => $spotify_user['user_id'],
                    'access_token' => $accessToken,
                    'refresh_token' => $spotify_user['refresh_token']
                ]
            );

            $api->setAccessToken($accessToken);

            $done = false;
            $offset = 0;
            $limit = 50;
            $data = [];
            while (!$done) {
                $tracks = $api->getMySavedTracks([
                    'limit' => $limit,
                    'offset' => $offset
                ]);
                if(!$tracks->items) {
                    $done = true;
                } else {
                    $data = array_merge($data, $tracks->items);
                    $offset = $offset + 50;
                }
            }

            $db->perform(
                $configs['sql']['content_spotify']['delete_content'],
                [
                    'account_spotify_id' => $spotify_user['id']
                ]
            );

            foreach ($data as $item) {
                $db->perform(
                    $configs['sql']['content_spotify']['insert_update'],
                    [
                        'account_spotify_id' => $spotify_user['id'],
                        'user_id' => $user['id'],
                        'item_id' => $item->track->id,
                        'json' => json_encode($item),
                        'date_added' => date('Y-m-d H:i:s', strtotime($item->added_at)),
                        'date_updated' => date('Y-m-d H:i:s', strtotime($item->added_at))
                    ]
                );
            }
        }
    }

    if ($cmd['refresh']) {
        echo $c(
"   __       __               _
  /__\ ___ / _|_ __ ___  ___| |__
 / \/// _ \ |_| '__/ _ \/ __| '_ \
/ _  \  __/  _| | |  __/\__ \ | | |
\/ \_/\___|_| |_|  \___||___/_| |_|
                                   "
            )
            ->white()->bold()->highlight('blue') . PHP_EOL;

        foreach ($spotify_users as $spotify_user) {
            // $api->setAccessToken($spotify_user['access_token']);
            $session->refreshAccessToken($spotify_user['refresh_token']);
            $accessToken = $session->getAccessToken();
            $result = $db->perform(
                $configs['sql']['account_spotify']['insert_update'],
                [
                    'user_id' => $spotify_user['user_id'],
                    'access_token' => $accessToken,
                    'refresh_token' => $spotify_user['refresh_token']
                ]
            );
        }

    }
