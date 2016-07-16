<?php

require_once("Base.php");

class VimeoData extends ExternalDataBase {

    private $clientKey;
    private $clientSecret;
    private $accessToken;

    public function __construct($clientKey, $clientSecret, $accessToken = null)
    {
        $this->clientKey = $clientKey;
        $this->clientSecret = $clientSecret;
        $this->accessToken = $accessToken;
        parent::__construct();
    }


    public function fetchClientToken()
    {
        $response = $this->httpClient->post(
            "https://api.vimeo.com/oauth/authorize/client", [
            'headers' => [
                'Authorization' => 'basic ' . base64_encode(
                    $this->clientKey . ":" . $this->clientSecret)
            ],
            'form_params' => [
                'grant_type' => 'client_credentials',
                'scope' => 'public private'
            ]]
        );
        $data = json_decode($response->getBody()->getContents());
        return $data;
    }


    public function getAuthorizeScreenUri($state, $redirectUri)
    {
        $params = [
            "response_type" => "code",
            "client_id" => $this->clientKey,
            "redirect_uri" => $redirectUri,
            "scope" => "public private",
            "state" => $state
        ];
        return "https://api.vimeo.com/oauth/authorize?" . http_build_query($params);
    }


    public function fetchAccessTokenData($code, $redirectUri)
    {
        $response = $this->httpClient->post(
            "https://api.vimeo.com/oauth/access_token", [
            'headers' => [
                'Authorization' => 'basic ' . base64_encode(
                    $this->clientKey . ":" . $this->clientSecret)
            ],
            'form_params' => [
                "grant_type" => "authorization_code",
                "code" => $code,
                "redirect_uri" => $redirectUri
            ]]
        );
        return json_decode($response->getBody()->getContents());
    }


    public function getArticles()
    {
        $response = $this->httpClient->post(
            'https://getpocket.com/v3/get',[
            'headers' => [
                'X-Accept' => 'application/json'
            ],
            'json' => [
                'consumer_key' => $this->consumerKey,
                'access_token' => $this->accessToken,
                'state' => 'all',
                'sort' => 'newest',
                'detailType' => 'complete'
            ]
        ]);
        return json_decode($response->getBody()->getContents());
    }
}
