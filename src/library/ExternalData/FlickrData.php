<?php

require_once("Base.php");
use MarkWilson\XmlToJson\XmlToJsonConverter;
use OAuth\OAuth1\Service\Flickr;
use OAuth\Common\Storage\Session;
use OAuth\Common\Consumer\Credentials;
use OAuth\Common\Http\Client\CurlClient;
use OAuth\Common\Http\Uri\UriFactory;
use OAuth\ServiceFactory;
require_once APPLICATION_PATH . 'src/library/Vendor/phpflickr/phpFlickr.php';

class FlickrData extends ExternalDataBase {

    private $client;
    private $clientId;
    private $clientSecret;
    private $converter;
    private $credentials;
    private $storage;
    private $access_token;
    private $access_token_secret;

    public function __construct($clientId, $clientSecret, $redirectUri)
    {

        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;

        $this->converter = new XmlToJsonConverter();

        $this->credentials = new Credentials(
            $clientId,
            $clientSecret,
            $redirectUri
        );

        $this->storage = new Session();

        $serviceFactory = new ServiceFactory();
        $this->client = $serviceFactory->createService(
            'Flickr', $this->credentials, $this->storage);

        parent::__construct();
    }

    public function getAuthorizationUri()
    {
        $token = $this->client->requestRequestToken();
        $oauth_token = $token->getAccessToken();

        return $this->client->getAuthorizationUri(
            ['oauth_token' => $oauth_token, 'perms' => 'read']);
    }

    /**
     * [getAccessToken description]
     * @param  [type] $oauth_token    [description]
     * @param  [type] $oauth_verifier [description]
     * @return \OAuth\OAuth1\Token\StdOAuth1Token                 The token
     */
    public function getAccessToken($oauth_token, $oauth_verifier)
    {
        $token = $this->storage->retrieveAccessToken('Flickr');
        $secret = $token->getAccessTokenSecret();

        $token = $this->client->requestAccessToken(
            $oauth_token,
            $oauth_verifier,
            $secret);

        $this->storage->storeAccessToken('Flickr', $token);

        return $token;
    }


    public function setAccessToken($access_token, $access_token_secret) {
        $this->access_token = $access_token;
        $this->access_token_secret = $access_token_secret;
    }


    public function getRecent()
    {

        $f = new phpFlickr($this->clientId, $this->clientSecret, true);
        $f->setToken($this->access_token);
        $response = $f->people_getPhotos("me", ["per_page" => 3]);
        print_r($response); exit();


        // $params = [
        //     "method" => "flickr.people.getPhotos",
        //     "api_key" => $this->credentials->getConsumerId(),
        //     "user_id" => "me",
        //     "per_page" => 3,
        //     "format" => "json",
        //     "nojsoncallback" => 1,
        //     "auth_token" => $this->access_token
        // ];
        //
        // $args = $params;
        //
        // ksort($args);
        //
        // $sig = null;
        // foreach ($args as $k=>$v){
        //     $sig .= $k . $v;
        // }
        // // echo $this->access_token_secret . $sig . PHP_EOL;
        // $params['api_sig'] = md5($this->access_token_secret . $sig);
        //
        // echo 'https://api.flickr.com/services/rest/?' . http_build_query($params) . PHP_EOL;
        //
        // $response = $this->httpClient->get(
        //     'https://api.flickr.com/services/rest/?' . http_build_query($params));
        //
        // $body = $response->getBody()->getContents();
        //
        // print_r($body); exit();




    }



}
