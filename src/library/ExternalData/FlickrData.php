<?php

require_once("Base.php");
use OAuth\OAuth1\Service\Flickr;
use OAuth\Common\Storage\Session;
use OAuth\Common\Consumer\Credentials;
use OAuth\Common\Http\Client\CurlClient;
use OAuth\Common\Http\Uri\UriFactory;
use OAuth\ServiceFactory;

class FlickrData extends ExternalDataBase {

    private $client;
    private $credentials;
    private $storage;

    public function __construct($clientId, $clientSecret, $redirectUri)
    {

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



}
