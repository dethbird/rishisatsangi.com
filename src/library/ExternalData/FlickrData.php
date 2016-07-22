<?php

require_once("Base.php");
use MarkWilson\XmlToJson\XmlToJsonConverter;
use OAuth\OAuth1\Service\Flickr;
use OAuth\Common\Storage\Session;
use OAuth\Common\Consumer\Credentials;
use OAuth\Common\Http\Client\CurlClient;
use OAuth\Common\Http\Uri\UriFactory;
use OAuth\ServiceFactory;

class FlickrData {

    private $client;
    private $clientId;
    private $clientSecret;
    private $oauth;
    private $oauthToken;
    private $oauthTokenSecret;
    private $accessToken;
    private $accessTokenSecret;


    public function __construct(
        $clientId, $clientSecret, $redirectUri, $accessToken = null, $accessTokenSecret = null)
    {

        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
        $this->redirectUri = $redirectUri;
        $this->accessToken = $accessToken;
        $this->accessTokenSecret = $accessTokenSecret;

        $this->oauth = new \Oauth(
            $this->clientId,
            $this->clientSecret);
        $this->oauth->enableSSLChecks();

    }


    public function getRequestToken()
    {
        return $this->oauth->getRequestToken(
            "https://www.flickr.com/services/oauth/request_token",
            $this->redirectUri);
    }


    public function setRequestToken($oauthToken, $oauthTokenSecret)
    {
        $this->oauthToken = $oauthToken;
        $this->oauthTokenSecret = $oauthTokenSecret;
        $this->oauth->setToken($this->oauthToken, $this->oauthTokenSecret);
    }


    public function getAuthorizationUri($oauth_token, $perms = 'read')
    {
        return 'https://www.flickr.com/services/oauth/authorize?oauth_token=' . $oauth_token . '&perms=' . $perms;

    }


    public function getAccessToken($oauth_token, $oauth_verifier)
    {
        return $this->oauth->getAccessToken(
            'https://www.flickr.com/services/oauth/access_token',
            null,
            $oauth_verifier
        );
    }


    public function setAccessToken($access_token, $access_token_secret) {
        $this->access_token = $access_token;
        $this->access_token_secret = $access_token_secret;
    }


    public function getRecent($flickr_user_id, $per_page = 250)
    {

        $params = [
            "method" => "flickr.people.getPhotos",
            "user_id" => $flickr_user_id,
            "per_page" => $per_page,
            "format" => "json",
            "nojsoncallback" => 1,
        ];

        $this->oauth->fetch(
            'https://api.flickr.com/services/rest',
            $params);

        return $this->oauth->getLastResponse();


    }



}
