<?php

use Aura\Sql\ExtendedPdo;

class DataBase {


    protected $dbClient;

    public function __construct($host, $database, $username, $password)
    {
        $this->dbClient = new ExtendedPdo(
            'mysql:host='.$host.';dbname='.$database,
            $username,
            $password);
    }


}
