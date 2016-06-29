<?php

require_once("Base.php");

class InstagramData extends ExternalDataBase {

    private $accessToken;
    private $clientId;
    private $clientSecret;

    public function __construct($clientId, $clientSecret)
    {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
        parent::__construct();
    }

    /**
     * create the url to the instagram authorization screen.
     * @param  [string] $redirectUri
     * @return [string]               The url.
     */
    public function createAuthUrl($redirectUri)
    {
        return "https://api.instagram.com/oauth/authorize/?client_id=".
        $this->clientId.
        "&redirect_uri=".
        $redirectUri."&response_type=code&scope=public_content";
    }


    /**
     * Fetch the auth token for the user from instagram using code
     * @param  [type] $redirectUri [description]
     * @param  [type] $code         [description]
     * @return [type]               [description]
     */
    public function getAuthTokenFromCode($redirectUri, $code)
    {

        $response = $this->httpClient->post(
            "https://api.instagram.com/oauth/access_token", [
                'form_params' => [
                    'client_id' => $this->clientId,
                    'client_secret' => $this->clientSecret,
                    'grant_type' => 'authorization_code',
                    'redirect_uri' => $redirectUri,
                    'code' => $code
                ]
            ]
        );
        $body = $response->getBody();
        $data = json_decode($body);
        return $data;
    }

    /**
     * Set the access token.
     * @param [string] $accessToken
     */
    public function setAccessToken($accessToken)
    {
        $this->accessToken = $accessToken;
    }

    /**
     * Get user's recently liked media.
     * @return [array] Array of liked media objects
     */
    public function getRecentLikedMedia()
    {
        $response = $this->httpClient->get("https://api.instagram.com/v1/users/self/media/liked?access_token=" . $this->accessToken);
        $body = $response->getBody();
        $data = json_decode($body);
        return $data;
    }

}
