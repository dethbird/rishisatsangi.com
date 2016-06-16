<?php

require_once("Base.php");

class PocketData extends ExternalDataBase {

    private $consumerKey;
    private $accessToken;

    public function __construct($consumerKey, $accessToken = null)
    {
        $this->consumerKey = $consumerKey;
        $this->accessToken = $accessToken;
        parent::__construct();
    }


    public function getAuthorizeScreenUri($code, $redirectUri)
    {
        return "https://getpocket.com/auth/authorize?request_token=" . $code . "&redirect_uri=" . $redirectUri;
    }

    public function fetchRequestCode($redirectUri)
    {
        $response = $this->httpClient->post(
            "https://getpocket.com/v3/oauth/request", [
            'headers' => [
                'Content-Type' => 'application/json; charset=UTF-8',
                'X-Accept' => 'application/json'
            ],
            'json' => [
                'consumer_key' => $this->consumerKey,
                'redirect_uri' => $redirectUri
            ]]
        );
        $data = json_decode($response->getBody()->getContents());
        return $data->code;
    }

    public function fetchAccessTokenData($code)
    {
        $response = $this->httpClient->post(
            "https://getpocket.com/v3/oauth/authorize", [
            'headers' => [
                'Content-Type' => 'application/json; charset=UTF-8',
                'X-Accept' => 'application/json'
            ],
            'json' => [
                'consumer_key' => $this->consumerKey,
                'code' => $code
            ]]
        );
        return json_decode($response->getBody()->getContents());
    }


    public function getArticles($count = 15, $cacheTime = 3600)
    {
        $cacheKey = md5("pocket:".$count);
        $cache = $this->retrieveCache($cacheKey, $cacheTime);

        if(!$cache) {
            $response = $this->httpClient->post(
                'https://getpocket.com/v3/get',[
                'headers' => [
                    'X-Accept' => 'application/json'
                ],
                'json' => [
                    'consumer_key' => $this->consumerKey,
                    'access_token' => $this->accessToken,
                    'state' => 'all',
                    'favorite' => 1,
                    'sort' => 'newest',
                    'detailType' => 'complete',
                    'count' => $count
                ]
            ]);
            $body = $response->getBody();
            $response = json_decode($body);
            $data = [];
            foreach ($response->list as $key=>$value) {
              $data[$key] = $value;
            }
            $this->storeCache($cacheKey, $data);
            return $data;
        } else {
            return $cache;
        }
    }
}
