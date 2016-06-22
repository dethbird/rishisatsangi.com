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
        ->describedAs('Pull the latest changes for a Google Drive user');
    $cmd->flag('t')
        ->aka('time')
        ->default(time())
        ->describedAs('Timestamp from which to start eg: 1466083468');
    $cmd->flag('h')
        ->aka('hours')
        ->default(24)
        ->describedAs('Hours back from timestamp to fetch eg: 24');

    if ($cmd['pull']) {
        $until = $cmd['time'] - $cmd['hours'] * 3600;

        echo $c(date("l Y-m-d h:i:sa", $cmd['time']) . " -> " . date("l Y-m-d h:i:sa", $until))
            ->yellow()->bold() . PHP_EOL;

        $gdrive_users = $db->fetchAll(
            $configs['sql']['account_gdrive']['get_gdrive_users'],[]);

        foreach ($gdrive_users as $gdrive_user) {
            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $gdrive_user['user_id']]);

            $client = new Google_Client();
            $client->setApplicationName("LikeDrop");
            $client->setAuthConfigFile(
                APPLICATION_PATH . "configs/" . $configs['service']['gdrive']['client_json_config_filename']);
            $client->setAccessToken(
                json_decode($gdrive_user['access_token'], true));
            $client->addScope(Google_Service_Drive::DRIVE_METADATA_READONLY);
            $client->setAccessType('offline');
            // Refresh the token if it's expired.
            // if ($client->isAccessTokenExpired()) {
            //     $client->refreshToken($client->getRefreshToken());
            //     file_put_contents($credentialsPath, $client->getAccessToken());
            // }




            $drive_service = new Google_Service_Drive($client);
            $changes = $drive_service->changes->listChanges('1', [
                'pageSize' => 10,
                'restrictToMyDrive' => true,
                'spaces' => 'drive'
            ]);
            var_dump($changes); die();


            // foreach ($articles->list as $article) {
            //
            //     if ($cmd['time'] > $article->time_added &&
            //         $article->time_added > $until) {
            //             echo $c(date("l Y-m-d h:i:sa", $article->time_added))
            //                 ->white()->bold() . " ";
            //             echo $c($article->resolved_url)
            //                 ->yellow()->bold() . PHP_EOL;
            //
            //         $db->perform(
            //             $configs['sql']['content_gdrive']['insert_update_gdrive_content_for_user'],
            //             [
            //                 'account_gdrive_id' => $gdrive_user['id'],
            //                 'user_id' => $user['id'],
            //                 'item_id' => $article->item_id,
            //                 'json' => json_encode($article),
            //                 'date_added' => date('Y-m-d H:i:s', $article->time_added),
            //                 'date_updated' => date('Y-m-d H:i:s', $article->time_updated)
            //             ]
            //         );
            //     }
            // }

        }
    }
