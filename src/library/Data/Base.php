<?php

use Aura\Sql\ExtendedPdo;

class DataBase {


    protected $client;

    public function __construct($host, $database, $username, $password)
    {
        $this->client = new ExtendedPdo(
            'mysql:host='.$host.';dbname='.$database,
            $username,
            $password);
    }

    public function lastInsertId(){
        return $this->client->lastInsertId();
    }

    public function fetchAll($stmt, $bindVars)
    {
        return $this->client->fetchAll($stmt, $bindVars);
    }

    public function fetchOne($stmt, $bindVars)
    {
        return $this->client->fetchOne($stmt, $bindVars);
    }

    public function perform($stmt, $bindVars)
    {
        return $this->client->perform($stmt, $bindVars);
    }


}
