<?php

require_once("Base.php");

class PocketData extends ExternalDataBase {

    private $consumer_key;
    private $access_token;

    public function __construct($consumer_key, $access_token)
    {
        $this->consumer_key = $consumer_key;
        $this->access_token = $access_token;
        parent::__construct();
    }

    /**
     *
     * @return array() a collection of articles from the pocket api response
     */
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
                    'consumer_key' => $this->consumer_key,
                    'access_token' => $this->access_token,
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
