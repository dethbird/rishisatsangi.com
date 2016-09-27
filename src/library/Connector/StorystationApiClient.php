<?php

class StorystationApiClient {

    /**
     * Guzzle Http Client
    */
    protected $client;


    public function __construct($apiUrl, $authToken = null)
    {
        if (!$authToken) {
          $this->client = new GuzzleHttp\Client([
              'base_uri' => 'http://' . $apiUrl ]);
        } else {
          $this->client = new GuzzleHttp\Client([
              'base_uri' => 'http://' . $apiUrl,
              'headers' => [
                'Auth-Token' => $authToken ]]);
        }

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

    public function getProjects()
    {

        try {
            $response = $this->client->request(
                'GET',
                '/api/projects'
            );
            return $response;
        } catch (Exception $e) {
            return $e->getResponse();
        }

    }

    public function getProject($id)
    {

        try {
            $response = $this->client->request(
                'GET',
                '/api/project/' . $id
            );
            return $response;
        } catch (Exception $e) {
            return $e->getResponse();
        }

    }
}
