<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/Data/Base.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/PocketData.php';
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
        ->describedAs('Pull the latest from a Pocket feed');

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

        echo $c('yank dem articles')
            ->yellow()->bold() . PHP_EOL;

        $pocket_users = $db->fetchAll(
            $configs['sql']['account_pocket']['get_all'],[]);

        foreach ($pocket_users as $pocket_user) {
            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $pocket_user['user_id']]);

            $pocketData = new PocketData(
                $configs['service']['pocket']['consumer_key'],
                $pocket_user['access_token']);

            $articles = $pocketData->getArticles();

            $db->perform(
                $configs['sql']['content_pocket']['delete_content_for_user'],
                [
                    'account_pocket_id' => $pocket_user['id']
                ]
            );

            foreach ($articles->list as $article) {
                $db->perform(
                    $configs['sql']['content_pocket']['insert_update_pocket_content_for_user'],
                    [
                        'account_pocket_id' => $pocket_user['id'],
                        'user_id' => $user['id'],
                        'item_id' => $article->item_id,
                        'json' => json_encode($pocketData->cleanData(
                            $article)),
                        'date_added' => date('Y-m-d H:i:s', $article->time_added),
                        'date_updated' => date('Y-m-d H:i:s', $article->time_updated)
                    ]
                );
            }
        }
    }
