<?php
    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once '../vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/PocketData.php';
    use Colors\Color;
    use Commando\Command;
    use Symfony\Component\Yaml\Yaml;

    $configs = Yaml::parse(file_get_contents("../configs/configs.yml"));
    $pocketData = new PocketData(
        $configs['service']['pocket']['consumer_key']);

    $cmd = new Command();
    $cmd->beepOnError();
    $cmd->flag('p')
        ->boolean()
        ->aka('pull')
        ->describedAs('Pull the latest from a Pocket feed');
    $cmd->flag('t')
        ->aka('time')
        ->describedAs('Timestamp from which to start eg: 1466083468');
    $cmd->flag('h')
        ->aka('hours')
        ->default(24)
        ->describedAs('Hours back from timestamp to fetch eg: 24');

    echo $cmd['pull'] . PHP_EOL;
    echo $cmd['time'] . PHP_EOL;
    echo $cmd['hours'] . PHP_EOL;
