<?php

class StorystationApiClient {

    /**
     * Guzzle Http Client
    */
    protected $client;


    public function __construct($apiUrl, $authToken = null)
    {

        $this->client = new GuzzleHttp\Client([
            'base_uri' => 'http://' . $apiUrl ]);
    }

    public function login($username, $password)
    {

        try {
            $response = $this->client->request(
                'POST',
                '/api/authorize',
                [
                    'json' => [
                        'username' => $username,
                        'password' => $password
                    ]
                ]
            );
            return $response;
        } catch (Exception $e) {
            return $e->getResponse();
        }

    }
}
