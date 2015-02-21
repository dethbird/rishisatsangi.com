<?php

	/**
	* 
	*    _____                                 __                
  	*   /  _  \ ______ ______     ______ _____/  |_ __ ________  
 	*  /  /_\  \\____ \\____ \   /  ___// __ \   __\  |  \____ \ 
	* /    |    \  |_> >  |_> >  \___ \\  ___/|  | |  |  /  |_> >
	* \____|__  /   __/|   __/  /____  >\___  >__| |____/|   __/ 
	*         \/|__|   |__|          \/     \/           |__|    
	*/
	// ini_set('error_reporting', E_ALL);
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	define("APPLICATION_PATH", __DIR__);
	date_default_timezone_set('America/Los_Angeles');

	// Ensure src/ is on include_path
	set_include_path(implode(PATH_SEPARATOR, array(
		__DIR__ ,
	    __DIR__ . '/src',
	    get_include_path(),
	)));
	global $httpClient, $configs;
	$siteData = null;

	/**
	* __________               __                                
	* \______   \ ____   _____/  |_  __________________  ______  
 	* |    |  _//  _ \ /  _ \   __\/  ___/\_  __ \__  \ \____ \ 
 	* |    |   (  <_> |  <_> )  |  \___ \  |  | \// __ \|  |_> >
 	* |______  /\____/ \____/|__| /____  > |__|  (____  /   __/ 
	*         \/                        \/             \/|__|    
	*/
	
	require 'vendor/autoload.php';
	use Symfony\Component\Yaml\Yaml;
	use Guzzle\Http\Client;

	$configs = Yaml::parse(file_get_contents("configs/config.yml"));
	$httpClient = new Client;


	// echo "<pre>";
	// print_r($configs);
	// echo "</pre>";
	// die();

	class AcmeExtension extends \Twig_Extension
	{
	    public function getFilters()
	    {
	        return array(
	            new \Twig_SimpleFilter('resizeImage', array($this, 'resizeImage')),
	            new \Twig_SimpleFilter('date_format', array($this, 'date_format')),
	            new \Twig_SimpleFilter('print_r', array($this, 'print_r')),
	            new \Twig_SimpleFilter('json_encode', array($this, 'json_encode')),
	            new \Twig_SimpleFilter('strip_tags', array($this, 'strip_tags'))
	        );
	    }

	    public function date_format($date, $format = "F j, Y g:i:a")
	    {
	    	// echo $date; die();
	        return date($format, strtotime($date));
	    }

	    public function resizeImage($url, $width, $height)
	    {
	        $url = parse_url($url);

	        return $url['scheme'] . "://" . $url['host'] . "/w". $width . "-h" . $height . $url['path'];
	    }

	    public function print_r($output)
	    {
	        return print_r($output,1);
	    }


	    public function strip_tags($html)
	    {
	        return strip_tags($html);
	    }	

	    public function json_encode($output)
	    {
	        return json_encode($output);
	    }

	    public function getName()
	    {
	        return 'acme_extension';
	    }
	}

	$app = new \Slim\Slim(array(
    	'view' => new Slim\Views\Twig(),
    	'templates.path' => __DIR__ . '/view',
	));
	$view = $app->view();
	$view->parserExtensions = array(
	    new \Slim\Views\TwigExtension(),
	    new AcmeExtension()
	);


 	$response = $httpClient->createRequest(
                    "GET",
                    $configs['app']['api_url']."?api_key=".$configs['app']['api_key']
                )->send();
 	$siteData = json_decode($response->getBody(true));

 	function fetchData($endpoint, $id){
 		global $configs, $httpClient;

	 	$response = $httpClient->createRequest(
                    "GET",
                    $configs['app']['api_url']."/".$endpoint."?id=".$id."&api_key=".$configs['app']['api_key']
                )->send();
 		$data = json_decode($response->getBody(true));
 		return $data[0];

 	}


	/**
	* __________               __  .__                
	* \______   \ ____  __ ___/  |_|__| ____    ____  
 	* |       _//  _ \|  |  \   __\  |/    \  / ___\ 
 	* |    |   (  <_> )  |  /|  | |  |   |  \/ /_/  >
 	* |____|_  /\____/|____/ |__| |__|___|  /\___  / 
	*         \/                           \//_____/  	
	*/

	$app->get('/', function () use ($app, $siteData, $configs, $httpClient) {
		
		//get recent activity
		$response = $httpClient->createRequest(
            "GET",
            $configs['app']['recent_activity_url']
    	)->send();
 		$recentActivity = json_decode($response->getBody(true));

	    $app->render('partials/home.html.twig', array(
		    	'siteData' => $siteData,
		    	'section'=>'index',
		    	'recentActivity' => $recentActivity->data
    		)
	    );
	});

	$app->get('/connect', function () use ($app, $siteData) {

	    $app->render('partials/connect.html.twig', array(
		    	'siteData' => $siteData,
		    	'section'=>'connect'
    		)
	    );
	});

	$app->get('/services', function () use ($app, $siteData) {

	    $app->render('partials/services.html.twig', array(
		    	'siteData' => $siteData,
		    	'section'=>'services'
    		)
	    );
	});

	$app->get('/about', function () use ($app, $siteData) {

	    $app->render('partials/about.html.twig', array(
		    	'siteData' => $siteData,
		    	'section'=>'about'
    		)
	    );
	});


	$app->get('/galleries/:id', function ($id) use ($app, $siteData) {
	    $app->render('partials/gallery.html.twig', array('siteData' => $siteData, 'data'=>fetchData("galleries", $id), 'section'=>'art'));
	});

	$app->get('/gallery/:section/:name', function ($section, $name) use ($app, $siteData, $configs) {

		if (!isset($configs['galleries'][$section][$name])) {
			$app->notFound();
		}

		$gallery = $configs['galleries'][$section][$name];

	    $app->render(
	    	'partials/gallery_decorated.html.twig',
	    	array(
	    		'siteData' => $siteData,
	    		'gallery' => $gallery,
	    		'data'=>fetchData(
	    			"galleries",
	    			$gallery['galleryId']),
	    		'section'=>'art'
    		)
    	);
	});

	$app->get('/archive/:section/:name', function ($section, $name) use ($app, $siteData, $configs) {

		if (!isset($configs['archive'][$section][$name])) {
			$app->notFound();
		}

		$gallery = $configs['archive'][$section][$name];

	    $app->render(
	    	'partials/gallery_decorated.html.twig',
	    	array(
	    		'siteData' => $siteData,
	    		'gallery' => $gallery,
	    		'data'=>fetchData(
	    			"galleries",
	    			$gallery['galleryId']),
	    		'section'=>'archive'
    		)
    	);
	});

	$app->get('/contents/:id', function ($id) use ($app, $siteData) {
	    $app->render('partials/content.html.twig', array('siteData' => $siteData, 'data'=>fetchData("contents", $id), 'section'=>'art'));
	});

	$app->get('/comic/:series/:slug', function ($series, $slug) use ($app, $siteData, $configs) {

		if (!isset($configs['comics'][$series][$slug])) {
			$app->notFound();
		}

		$comic = $configs['comics'][$series][$slug];

	    $app->render(
	    	'partials/comic.html.twig',
	    	array(
	    		'siteData' => $siteData,
	    		'comic' => $comic,
	    		'data'=>fetchData(
	    			"contents",
	    			$comic['contentId']),
	    		'section'=>'comics'
    		)
    	);
	});

	$app->get('/comics/:id', function ($id) use ($app, $siteData) {
	    $app->render('partials/title.html.twig', array('siteData' => $siteData, 'data'=>fetchData("titles", $id), 'section'=>'comics'));
	});

	$app->get('/issues/:id', function ($id) use ($app, $siteData) {
	    $app->render('partials/issue.html.twig', array('siteData' => $siteData, 'data'=>fetchData("issues", $id), 'section'=>'comics'));
	});

	$app->get('/blogs/:id', function ($id) use ($app, $siteData) {
	    $app->render('partials/feed.html.twig', array('siteData' => $siteData, 'data'=>fetchData("feeds", $id), 'section'=>'blogs'));
	});



	/**
	* __________            ._._._.
	* \______   \__ __  ____| | | |
 	* |       _/  |  \/    \ | | |
 	* |    |   \  |  /   |  \|\|\|	
 	* |____|_  /____/|___|  /_____
	*        \/           \/\/\/\/	
	*/
	$app->run();
?>