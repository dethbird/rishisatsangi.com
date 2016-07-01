<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/GoogleData.php';
    require_once APPLICATION_PATH . 'src/library/Data/Base.php';
    use Colors\Color;
    use Commando\Command;
    use Symfony\Component\Yaml\Yaml;
    use MeadSteve\Console\Shells\BasicShell;

    $c = new Color();
    $configs = Yaml::parse(
        file_get_contents(APPLICATION_PATH . "configs/configs.yml"));
    $db = new DataBase(
        $configs['mysql']['host'],
        $configs['mysql']['database'],
        $configs['mysql']['user'],
        $configs['mysql']['password']);

    $googleData = new GoogleData(
        "LikeDrop",
        APPLICATION_PATH . "configs/" . $configs['service']['gdrive']['client_json_config_filename']);

    $gdrive_users = $db->fetchAll(
        $configs['sql']['account_gdrive']['get_all'],[]);

    $cmd = new Command();
    $cmd->beepOnError();
    $cmd->flag('p')
        ->boolean()
        ->aka('pull')
        ->describedAs('Pull the latest from Youtube\'s watch later.');
    $shell = new BasicShell();

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

        echo $c('Yank dem vids.')
            ->yellow()->bold() . PHP_EOL;

        foreach ($gdrive_users as $gdrive_user) {

            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $gdrive_user['user_id']]);
            $googleData->setAccessToken($gdrive_user['access_token']);

            // refresh if needed
            if ($googleData->isAccessTokenExpired()) {
                echo $c("EXPIRED TOKEN")
                    ->red()->bold() . PHP_EOL;

                $accessTokenData = $googleData->refreshAccessToken(
                    $gdrive_user['refresh_token']);
                $result = $db->perform(
                    $configs['sql']['account_gdrive']['insert_update_gdrive_user'],
                    [
                        'user_id' => $gdrive_user['user_id'],
                        'access_token' => json_encode($accessTokenData),
                        'refresh_token' => $gdrive_user['refresh_token']
                    ]
                );
                echo $c("REFRESHED TOKEN")
                    ->green()->bold() . PHP_EOL;

            }

            $channels = $googleData->getYoutubeChannels('contentDetails', [
                'mine' => 'true']);
            $videos = $googleData->getYoutubePlaylistItems('snippet', [
                'playlistId' => $channels[0]->contentDetails['relatedPlaylists']['watchLater'],
                'maxResults' => 50
            ]);

            $db->perform(
                $configs['sql']['content_youtube']['delete_content_for_user'],
                [
                    'account_gdrive_id' => $gdrive_user['id']
                ]
            );

            foreach ($videos as $video) {
                // print_r($video); exit();
                $db->perform(
                    $configs['sql']['content_youtube']['insert_update_content_for_user'],
                    [
                        'account_gdrive_id' => $gdrive_user['id'],
                        'user_id' => $user['id'],
                        'item_id' => $video->id,
                        'json' => json_encode($video),
                        'date_added' => date('Y-m-d H:i:s', strtotime($video->snippet['publishedAt'])),
                        'date_updated' => date('Y-m-d H:i:s', strtotime($video->snippet['publishedAt']))
                    ]
                );
            }



            exit();


        }
    }
