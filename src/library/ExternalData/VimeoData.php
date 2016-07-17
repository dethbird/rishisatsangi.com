<?php

require_once("Base.php");
use Vimeo\Vimeo;

class VimeoData extends ExternalDataBase {

    private $clientKey;
    private $clientSecret;
    private $accessToken;
    private $client;

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


    public function getWatchLaterVideos()
    {
        $vimeo = new Vimeo(
            $this->clientKey,
            $this->clientSecret,
            $this->accessToken
        );
        $done = false;
        $page = 1;
        $per_page = 50;
        $data = [];
        while (!$done) {
            $response = $vimeo->request('/me/watchlater', [
                'per_page' => $per_page, 'page' => $page ],
                'GET');
            if(!$response['body']['data']) {
                $done = true;
            } else {
                $data = array_merge($data, $response['body']['data']);
                $page++;
            }
        }

        return $data;
    }
}
