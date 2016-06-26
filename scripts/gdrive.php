<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/GoogleDrive.php';
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

    $googleDrive = new GoogleDrive(
        "LikeDrop",
        APPLICATION_PATH . "configs/" . $configs['service']['gdrive']['client_json_config_filename']);

    $gdrive_users = $db->fetchAll(
        $configs['sql']['account_gdrive']['get_all'],[]);

    $cmd = new Command();
    $cmd->beepOnError();
    $cmd->flag('p')
        ->boolean()
        ->aka('pull')
        ->describedAs('Pull the latest changes for a Google Drive user.');
    $cmd->flag('r')
        ->boolean()
        ->aka('refresh')
        ->describedAs('Refresh the user\'s access token.');
    $cmd->flag('c')
        ->boolean()
        ->aka('cache')
        ->describedAs('Cache image thumbnails for JPG, PNG, and PSD.');
    $cmd->flag('l')
        ->aka('limit')
        ->default(100)
        ->describedAs('Limit for number of items to import.');
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

        echo $c("Limit: ".$cmd['limit'])
            ->yellow()->bold() . PHP_EOL;

        foreach ($gdrive_users as $gdrive_user) {

            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $gdrive_user['user_id']]);
            $googleDrive->setAccessToken($gdrive_user['access_token']);

            if ($googleDrive->isAccessTokenExpired()) {
                echo $c("EXPIRED TOKEN")
                    ->red()->bold() . PHP_EOL;

                $accessTokenData = $googleDrive->refreshAccessToken(
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

            $fileList= $googleDrive->listFiles([
                'orderBy' => 'modifiedByMeTime desc',
                'pageSize' => $cmd['limit'],
                'spaces' => 'drive'
            ]);

            foreach($fileList as $fileInfo) {

                $file = $googleDrive->getFile($fileInfo->id);

                echo $c(date('Y-m-d H:i:s', strtotime($file->modifiedByMeTime)))
                    ->white()->bold() . " ";
                echo $c($file->name)
                    ->yellow()->bold() . PHP_EOL;

                $db->perform(
                    $configs['sql']['content_gdrive_files']['insert_update_files_for_user'],
                    [
                        'account_gdrive_id' => $gdrive_user['id'],
                        'user_id' => $user['id'],
                        'item_id' => $file->id,
                        'json' => json_encode($file),
                        'date_added' => date('Y-m-d H:i:s', strtotime($file->createdTime)),
                        'date_updated' => date('Y-m-d H:i:s', strtotime($file->modifiedByMeTime))
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

        foreach ($gdrive_users as $gdrive_user) {
            $googleDrive->setAccessToken($gdrive_user['access_token']);
            $accessTokenData = $googleDrive->refreshAccessToken(
                $gdrive_user['refresh_token']);
            $result = $db->perform(
                $configs['sql']['account_gdrive']['insert_update_gdrive_user'],
                [
                    'user_id' => $gdrive_user['user_id'],
                    'access_token' => json_encode($accessTokenData),
                    'refresh_token' => $gdrive_user['refresh_token']
                ]
            );
        }

    }

    if ($cmd['cache']) {
        echo $c(
"   ___           _
  / __\__ _  ___| |__   ___
 / /  / _` |/ __| '_ \ / _ \
/ /__| (_| | (__| | | |  __/
\____/\__,_|\___|_| |_|\___|
                            "
            )
            ->white()->bold()->highlight('blue') . PHP_EOL;

        foreach ($gdrive_users as $gdrive_user) {
            $googleDrive->setAccessToken($gdrive_user['access_token']);
            $gdrive_files = $db->fetchAll(
                $configs['sql']['content_gdrive_files']['get_by_account_gdrive_id'],[
                    'limit' => (int) $cmd['limit'],
                    'account_gdrive_id' => $gdrive_user['id']]);
            foreach ($gdrive_files as $file) {
                $fileObj = json_decode($file['json']);
                if (in_array($fileObj->mimeType, ["image/jpeg", "image/png"])) {
                    echo $c($fileObj->mimeType . ': ')
                        ->white()->bold() . " ";
                    echo $c($fileObj->name)
                        ->yellow()->bold() . PHP_EOL;

                    $cacheKey = $googleDrive->getThumbnailCacheKey($fileObj);
                    $contents = $googleDrive->downloadFile($fileObj->id);

                    $file = APPLICATION_PATH .
                        $configs['service']['gdrive']['thumbnail_cache_folder'] . "/" . $cacheKey;

                    $wh = fopen($file, 'w+b');
                    echo $cacheKey . PHP_EOL;
                    while ($chunk = $contents->read(4096)) {
                        fwrite($wh, $chunk);
                    }
                    fclose($wh);

                    $shell->executeCommand('convert', array(
                        "-resize",
                        "1024",
                        $file,
                        $file
                    ));

                }
            }
        }

    }
