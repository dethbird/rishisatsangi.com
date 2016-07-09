<?php

class Projects {


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
            $this->configs['sql']['projects']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['projects']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    /**
     * [createProjectStoryboard description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function createProjectStoryboard($data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_storyboards']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'project_id' => $data['project_id'],
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_storyboards']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function createProjectStoryboardPanel($data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_storyboard_panels']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'storyboard_id' => $data['storyboard_id'],
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_storyboard_panels']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function createProjectStoryboardPanelRevision($data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_storyboard_panel_revisions']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'panel_id' => $data['panel_id'],
                'content' => $data['content'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_storyboard_panel_revisions']['select_by_id'],
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
            $this->configs['sql']['projects']['update'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id,
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['projects']['select_by_id'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function updateProjectStoryboard($id, $data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_storyboards']['update'],
            [
                'id' => $id,
                'project_id' => $data['project_id'],
                'user_id' => $this->securityContext->id,
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_storyboards']['select_by_id'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function updateProjectStoryboardPanel($id, $data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_storyboard_panels']['update'],
            [
                'id' => $id,
                'storyboard_id' => $data['storyboard_id'],
                'user_id' => $this->securityContext->id,
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_storyboard_panels']['select_by_id'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function updateProjectStoryboardPanelRevision($id, $data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_storyboard_panel_revisions']['update'],
            [
                'id' => $id,
                'panel_id' => $data['panel_id'],
                'user_id' => $this->securityContext->id,
                'content' => $data['content'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_storyboard_panel_revisions']['select_by_id'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }


    /**
     * get top level project objects by user.
     * @return array [description]
     */
    public function getProjects()
    {
        $projects = $this->db->fetchAll(
            $this->configs['sql']['projects']['select_by_user'],
            [
                'user_id' => $this->securityContext->id
            ]
        );

        return $projects;

    }


    /**
     * [fetchOne description]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function fetchOne($id)
    {
        $project = $this->db->fetchOne(
            $this->configs['sql']['projects']['select_by_id'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id
            ]
        );

        return $project;
    }

    public function fetchStoryboardById($storyboardId)
    {
        $storyboard = $this->db->fetchOne(
            $this->configs['sql']['project_storyboards']['select_by_id'],
            [
                'id' => $storyboardId,
                'user_id' => $this->securityContext->id
            ]
        );

        return $storyboard;
    }

    public function fetchStoryboardPanelById($panelId)
    {
        $storyboard = $this->db->fetchOne(
            $this->configs['sql']['project_storyboard_panels']['select_by_id'],
            [
                'id' => $panelId,
                'user_id' => $this->securityContext->id
            ]
        );

        return $storyboard;
    }

    public function fetchStoryboardPanelRevisionById($revisionId)
    {
        $revision = $this->db->fetchOne(
            $this->configs['sql']['project_storyboard_panel_revisions']['select_by_id'],
            [
                'id' => $revisionId,
                'user_id' => $this->securityContext->id
            ]
        );

        return $revision;
    }

    public function orderProjectStoryboards($params)
    {
        $project_id = $params['project_id'];
        foreach ($params['items'] as $id=>$order){
            if($order != "") {
                $retult = $this->db->perform(
                    $this->configs['sql']['project_storyboards']['update_order'],
                    [
                        'id' => $id,
                        'project_id' => $project_id,
                        'sort_order' => $order,
                        'user_id' => $this->securityContext->id
                    ]
                );
            }
        }
    }

    /**
     * Builds out the project tree given project as array
     * @param  [type] $project [description]
     * @return [type]          [description]
     */
    public function hydrateProject($project)
    {
        $storyboards = $this->db->fetchAll(
            $this->configs['sql']['project_storyboards']['select_by_project'],
            [
                'project_id' => (int) $project['id'],
                'user_id' => $this->securityContext->id
            ]
        );

        foreach ($storyboards as $storyboardIdx=>$storyboard) {
            $panels = $this->db->fetchAll(
                $this->configs['sql']['project_storyboard_panels']['select_by_storyboard'],
                [
                    'storyboard_id' => (int) $storyboard['id'],
                    'user_id' => $this->securityContext->id
                ]
            );

            foreach ($panels as $panelIdx=>$panel){

                $revisions = $this->db->fetchAll(
                    $this->configs['sql']['project_storyboard_panel_revisions']['select_by_panel'],
                    [
                        'panel_id' => (int) $panel['id'],
                        'user_id' => $this->securityContext->id
                    ]
                );

                $panel['revisions'] = $revisions;

                $panels[$panelIdx] = $panel;

            }

            $storyboard['panels'] = $panels;
            $storyboards[$storyboardIdx] = $storyboard;
        }

        $project['storyboards'] = $storyboards;

        return $project;
    }


}
