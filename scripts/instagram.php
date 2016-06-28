<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/Data/Base.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/InstagramData.php';
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
        ->describedAs('Pull the latest Instagram liked');

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

        $instagram_users = $db->fetchAll(
            $configs['sql']['account_instagram']['get_all'],[]);

        foreach ($instagram_users as $instagram_user) {
            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $instagram_user['user_id']]);

            $instagramData = new InstagramData(
                $configs['service']['instagram']['client_id'],
                $configs['service']['instagram']['client_secret']);

            var_dump($user); exit();

            $articles = $instagramData->getArticles();

            foreach ($articles->list as $article) {

                if ($cmd['time'] > $article->time_added &&
                    $article->time_added > $until) {
                        echo $c(date("l Y-m-d h:i:sa", $article->time_added))
                            ->white()->bold() . " ";
                        echo $c($article->resolved_url)
                            ->yellow()->bold() . PHP_EOL;
                    // print_r(json_encode($article));
                    $db->perform(
                        $configs['sql']['content_instagram']['insert_update_instagram_content_for_user'],
                        [
                            'account_instagram_id' => $instagram_user['id'],
                            'user_id' => $user['id'],
                            'item_id' => $article->item_id,
                            'json' => json_encode($instagramData->cleanData(
                                $article)),
                            'date_added' => date('Y-m-d H:i:s', $article->time_added),
                            'date_updated' => date('Y-m-d H:i:s', $article->time_updated)
                        ]
                    );
                }
            }

        }
    }
