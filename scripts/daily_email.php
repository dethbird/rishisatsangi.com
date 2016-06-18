<?php

    define("APPLICATION_PATH", __DIR__ . "/../");
    date_default_timezone_set('America/New_York');

    require_once APPLICATION_PATH . 'vendor/autoload.php';
    require_once APPLICATION_PATH . 'src/library/Data/Base.php';
    require_once APPLICATION_PATH . 'src/library/ExternalData/PocketData.php';
    require_once APPLICATION_PATH . 'src/library/View/Extension/TemplateHelpers.php';
    use Colors\Color;
    use Commando\Command;
    use Symfony\Component\Yaml\Yaml;
    use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

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
    $twig->addExtension( new TemplateHelpers() );

    $cmd = new Command();
    $cmd->beepOnError();
    $cmd->flag('s')
        ->boolean()
        ->aka('send')
        ->describedAs('Send a user their latest LikeDropped content');
    $cmd->flag('o')
        ->boolean()
        ->aka('output')
        ->describedAs('Output mode -- don\'t actually send an email, output HTML instead');
    $cmd->flag('t')
        ->aka('time')
        ->default(time())
        ->describedAs('Timestamp from which to start eg: 1466083468');
    $cmd->flag('h')
        ->aka('hours')
        ->default(24)
        ->describedAs('Hours back from timestamp to fetch eg: 24');

    if ($cmd['send']) {

        $until = $cmd['time'] - $cmd['hours'] * 3600;

        echo $c(date("l Y-m-d h:i:sa", $cmd['time']) . " -> " . date("l Y-m-d h:i:sa", $until))
            ->yellow()->bold() . PHP_EOL;

        $pocket_users = $db->fetchAll(
            $configs['sql']['account_pocket']['get_pocket_users'],[]);

        foreach ($pocket_users as $pocket_user) {
            $user = $db->fetchOne(
                $configs['sql']['users']['get_by_id'],
                ['id' => $pocket_user['user_id']]);

            $pocket_articles = $db->fetchAll(
                $configs['sql']['content_pocket']['get_content_by_user'],[
                    'until' => date('Y-m-d H:i:s', $until),
                    'user_id' => $pocket_user['user_id']]);

            $html = $twig->render(
                'emails/daily_email.html.twig',
                [
                    'user' => $user,
                    'from' => $until,
                    'until' => $cmd['time'],
                    'pocket_articles' => $pocket_articles
                ]);

            $css = file_get_contents('https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css');

            $css .= PHP_EOL . file_get_contents(
                APPLICATION_PATH . 'src/views/css/email.css');

            $cssToInlineStyles = new CssToInlineStyles();
            $mergedHtml = $cssToInlineStyles->convert($html, $css);
            // echo $mergedHtml . PHP_EOL;

            $mail = new PHPMailer;
            $mail->Subject = $configs['email']['daily_email']['subject'] . " " . time();
            $mail->setFrom(
                $configs['email']['daily_email']['from'],
                $configs['email']['daily_email']['from_name']
            );
            $mail->addAddress($user['email'], $user['username']);
            $mail->isHTML(true);
            $mail->Body = $mergedHtml;

            if ($cmd['output']) {
                echo PHP_EOL . $html . PHP_EOL;
            } else {
                if(!$mail->send()) {
                    echo 'Message could not be sent.';
                    echo 'Mailer Error: ' . $mail->ErrorInfo;
                } else {
                    echo 'Message has been sent';
                }
            }
            echo PHP_EOL;
        }
    }
