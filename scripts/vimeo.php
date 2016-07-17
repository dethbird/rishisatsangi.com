<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/Data/Base.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/VimeoData.php';
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
        ->describedAs('Pull the latest from a Vimeo watch later');

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

        echo $c('yank dem vids')
            ->yellow()->bold() . PHP_EOL;

        $vimeo_users = $db->fetchAll(
            $configs['sql']['account_vimeo']['get_all'],[]);

        foreach ($vimeo_users as $vimeo_user) {
            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $vimeo_user['user_id']]);

            $vimeoData = new VimeoData(
                $configs['service']['vimeo']['client_key'],
                $configs['service']['vimeo']['client_secret'],
                $vimeo_user['access_token']);

            $videos = $vimeoData->getWatchLaterVideos();

            $db->perform(
                $configs['sql']['content_vimeo']['delete_content'],
                [
                    'account_vimeo_id' => $vimeo_user['id']
                ]
            );

            foreach ($videos as $item) {
                $db->perform(
                    $configs['sql']['content_vimeo']['insert_update'],
                    [
                        'account_vimeo_id' => $vimeo_user['id'],
                        'user_id' => $user['id'],
                        'item_id' => $item['uri'],
                        'json' => json_encode($item),
                        'date_added' => date('Y-m-d H:i:s', strtotime($item['created_time'])),
                        'date_updated' => date('Y-m-d H:i:s', strtotime($item['modified_time']))
                    ]
                );
            }
        }
    }
