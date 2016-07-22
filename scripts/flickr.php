<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/Data/Base.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/FlickrData.php';
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
        ->describedAs('Pull the latest Flickr uploaded');

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

        $until = $cmd['time'] - $cmd['hours'] * 3600;

        echo $c("yankin' dem likes.")
            ->yellow()->bold() . PHP_EOL;

        $flickr_users = $db->fetchAll(
            $configs['sql']['account_flickr']['get_all'],[]);

        foreach ($flickr_users as $flickr_user) {

            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $flickr_user['user_id']]);

            $flickrData = new FlickrData(
                $configs['service']['flickr']['key'],
                $configs['service']['flickr']['secret'],
                "http://".$configs['server']['hostname'] . "/service/flickr/redirect"
            );

            $flickrData->setAccessToken(
                $flickr_user['access_token'],
                $flickr_user['access_token_secret']
            );

            $data = json_decode($flickrData->getRecent($flickr_user['flickr_user_id']));

            print_r($data);

        }
    }
