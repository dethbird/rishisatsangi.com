<?php

    //  php scripts/import_project_from_yml.php -i -u 1 -f /home/explosioncorp/public_ftp/incoming/index.yml


    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/Data/Base.php';
    require_once APPLICATION_PATH . 'src/library/Logic/Projects.php';
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
    $cmd->flag('id')
        ->aka('project_id')
        ->require(true)
        ->describedAs('Id of the project to delete.');



    echo $c(
"   ___       _ _
/ _ \_   _| | |
/ /_)/ | | | | |
/ ___/| |_| | | |
\/     \__,_|_|_|
             "
        )
        ->white()->bold()->highlight('blue') . PHP_EOL;

    echo $c("Delete project ".$cmd['id'].".")
        ->yellow()->bold() . PHP_EOL;

    $project = $db->fetchOne(
        'SELECT * FROM projects WHERE id = :id',
        ['id' => $cmd['id']]
    );

    $user = $db->fetchOne(
        'SELECT * FROM users WHERE id = :id',
        ['id' => $project['user_id']]
    );

    $projectService = new Projects($db, $configs, (object) $user);

    $project = $projectService->hydrateProject($project);

    foreach ($project['storyboards'] as $storyboard){
        if(is_array($storyboard['panels'])){
            foreach($storyboard['panels'] as $panel){
                if(is_array($panel['comments'])){
                    foreach($panel['comments'] as $comment){
                        $result = $db->perform(
                            'DELETE FROM comments WHERE id = :id',
                            ['id' => $comment['id']]
                        );

                    }
                }
            }
        }
    }

    $result = $db->perform(
        'DELETE FROM projects WHERE id = :id',
        ['id'=>$project['id']]
    );

    $result = $db->perform(
        'ALTER TABLE comments AUTO_INCREMENT = 1',
        []
    );

    $result = $db->perform(
        'ALTER TABLE projects AUTO_INCREMENT = 1',
        []
    );

    $result = $db->perform(
        'ALTER TABLE project_characters AUTO_INCREMENT = 1',
        []
    );

    $result = $db->perform(
        'ALTER TABLE project_character_revisions AUTO_INCREMENT = 1',
        []
    );

    $result = $db->perform(
        'ALTER TABLE project_storyboards AUTO_INCREMENT = 1',
        []
    );

    $result = $db->perform(
        'ALTER TABLE project_storyboard_panels AUTO_INCREMENT = 1',
        []
    );

    $result = $db->perform(
        'ALTER TABLE project_storyboard_panel_revisions AUTO_INCREMENT = 0',
        []
    );

    $result = $db->perform(
        'ALTER TABLE project_users AUTO_INCREMENT = 0',
        []
    );
