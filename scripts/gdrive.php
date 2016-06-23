<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/GoogleDrive.php';
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
    $cmd->flag('l')
        ->aka('limit')
        ->default(100)
        ->describedAs('Limit for number of items to import');

    if ($cmd['pull']) {
        $until = $cmd['time'] - $cmd['hours'] * 3600;

        echo $c(date("l Y-m-d h:i:sa", $cmd['time']) . " -> " . date("l Y-m-d h:i:sa", $until))
            ->yellow()->bold() . PHP_EOL;

        $googleDrive = new GoogleDrive(
            "LikeDrop",
            APPLICATION_PATH . "configs/" . $configs['service']['gdrive']['client_json_config_filename']
        );

        $gdrive_users = $db->fetchAll(
            $configs['sql']['account_gdrive']['get_all'],[]);

        foreach ($gdrive_users as $gdrive_user) {

            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $gdrive_user['user_id']]);
            $googleDrive->setAccessToken($gdrive_user['access_token']);

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
