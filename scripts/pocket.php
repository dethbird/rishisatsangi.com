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
    $twigLoader = new Twig_Loader_Filesystem(APPLICATION_PATH . 'src/views');
    $twig = new Twig_Environment($twigLoader);

    $cmd = new Command();
    $cmd->beepOnError();
    $cmd->flag('p')
        ->boolean()
        ->aka('pull')
        ->describedAs('Pull the latest from a Pocket feed');
    $cmd->flag('s')
        ->boolean()
        ->aka('send')
        ->describedAs('Send a user their latest Pocket articles');
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
            $configs['sql']['account_pocket']['get_pocket_users'],[]);

        foreach ($pocket_users as $pocket_user) {
            $user = $db->fetchOne(
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

                    $db->perform(
                        $configs['sql']['content_pocket']['insert_update_pocket_content_for_user'],
                        [
                            'user_id' => $user['id'],
                            'item_id' => $article->item_id,
                            'json' => json_encode($article),
                            'date_added' => date('Y-m-d H:i:s', $article->time_added),
                            'date_updated' => date('Y-m-d H:i:s', $article->time_updated)
                        ]
                    );
                }
            }

        }
    }

    if ($cmd['send']) {

        $mail = new PHPMailer;
        $mail->setFrom('webmaster@explosioncorp.com', 'Explosioncorp Mailer');
        $mail->addAddress('rishi.satsangi@gmail.com', 'Joe User');
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'Here is the subject';
        $mail->Body    = $twig->render(
            'emails/pocket_send.html.twig', ['key' => 'farts']);

        if(!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }

        echo PHP_EOL;
    }
