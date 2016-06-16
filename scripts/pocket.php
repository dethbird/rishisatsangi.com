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
        $pocket_users = $db->fetchAll(
            $configs['sql']['user_account_pocket']['get_pocket_users'],[]);

        foreach ($pocket_users as $pocket_user) {
            $user = $db->fetchAll(
                $configs['sql']['users']['get_by_id'],[
                    'id' => $pocket_user['user_id']
                ]);
            $pocketData = new PocketData(
                $configs['service']['pocket']['consumer_key'],
                $pocket_user['access_token']);

            $articles = $pocketData->getArticles();

            foreach ($articles->list as $article) {

                if ($cmd['time'] > $article->time_added &&
                    $article->time_added > $until) {
                        echo $c(date("l Y-m-d h:i:sa", $article->time_added))
                            ->white()->bold() . " ";
                        echo $c($article->resolved_url)
                            ->yellow()->bold() . PHP_EOL;

                    print_r($article);
                }
            }

        }
    }
