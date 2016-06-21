<?php

require_once(APPLICATION_PATH . "src/library/Cache/Manager.php");

class ExternalDataBase {

    /**
     * Guzzle Http Client
    */
    protected $httpClient;
    protected $cacheManager;

    public function __construct()
    {
        $this->cacheManager = new CacheManager();
        $this->httpClient = new GuzzleHttp\Client();
    }

    protected function retrieveCache($key, $cacheTime = null)
    {
        return $this->cacheManager->retrieve($key, $cacheTime);
    }

    protected function storeCache($key, $data)
    {
        $this->cacheManager->store($key, $data);
    }

    private function replaceCharacters($string) {
        return iconv('UTF-8', 'ASCII//TRANSLIT', $string);
    }

    public function cleanData($data) {
        if(is_string($data)) {
            return $this->replaceCharacters($data);
        } else if (is_object($data)) {
            foreach ($data as $k => $v) {
                if (is_string($v)) {
                    $data->$k = $this->replaceCharacters($v);
                } else if (is_object($v)){
                    $this-$k = $this->cleanData($v);
                }
            }
        }

        return $data;
    }
}
