<?php

class Scripts {


    protected $db;
    protected $configs;
    protected $securityContext;


    /**
     * Inject dependencies
     * @param DataBase $db              [description]
     * @param array $configs         [description]
     * @param object $securityContext [description]
     */
    public function __construct($db, $configs, $securityContext)
    {
        $this->db = $db;
        $this->configs = $configs;
        $this->securityContext = $securityContext;
    }

    /**
     * [create description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function create($data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['scripts']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['scripts']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    /**
     * [update description]
     * @param  [type] $id   [description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function update($id, $data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['scripts']['update'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id,
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['scripts']['select_by_id'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    /**
     * get scripts by user.
     * @return array [description]
     */
    public function fetchAll()
    {
        $result = $this->db->fetchAll(
            $this->configs['sql']['scripts']['select_by_user'],
            [
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;

    }

    /**
     * [fetchOne description]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function fetchOne($id)
    {
        $result = $this->db->fetchOne(
            $this->configs['sql']['scripts']['select_by_id'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }


}
