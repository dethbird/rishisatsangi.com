<?php

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
        $this->oauth->enableDebug();

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
    }


    public function getAuthorizationUri($oauth_token, $perms = 'delete')
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
        $this->oauth->setToken($access_token, $access_token_secret);
    }


    public function getRecent($flickr_user_id, $per_page = 250)
    {

        $params = [
            "api_key" => $this->clientId,
            "method" => "flickr.people.getPhotos",
            "user_id" => $flickr_user_id,
            "per_page" => $per_page,
            "privacy_filter" => 5,
            "extras" => "description,date_upload,date_taken,last_update,url_t,url_m,url_l,url_o",
            "format" => "json",
            "nojsoncallback" => 1
        ];

        $this->oauth->fetch(
            'https://api.flickr.com/services/rest',
            $params);

        $response_info = $this->oauth->getLastResponseInfo();
        $response_headers = $this->oauth->getLastResponseHeaders();

        // print_r($response_info);

        $response = $this->oauth->getLastResponse();
        return $response;

    }



}
