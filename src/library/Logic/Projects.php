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

    public function addProjectUser($data)
    {

        // find user by id
        $user = $this->db->fetchOne(
            $this->configs['sql']['users']['get_by_email'],
            [
                'email' => trim($data['email'])
            ]
        );

        if (!$user) {
            if (trim($data['username']) == "") {
                $data['username'] = $data['email'];
            }

            $result = $this->db->perform(
                $this->configs['sql']['users']['insert'],
                [
                    'username' => trim($data['username']),
                    'email' => trim($data['email']),
                    'password' => md5(time())
                ]
            );

            $user = $this->db->fetchOne(
                $this->configs['sql']['users']['get_by_id'],
                [
                    'id' => $this->db->lastInsertId()
                ]
            );
        }

        $result = $this->db->perform(
            $this->configs['sql']['project_users']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'project_user_id' => $user['id'],
                'project_id' => $data['project_id']
            ]
        );


        return true;
    }

    public function createProjectCharacter($data, $sort_order = 0)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_characters']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'project_id' => $data['project_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'sort_order' => $sort_order
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_characters']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function createProjectCharacterRevision($data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_character_revisions']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'character_id' => $data['character_id'],
                'content' => $data['content'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_character_revisions']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function createProjectConceptArt($data, $sort_order)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_concept_art']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'project_id' => $data['project_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'sort_order' => $sort_order
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_concept_art']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function createProjectConceptArtRevision($data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_concept_art_revisions']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'concept_art_id' => $data['concept_art_id'],
                'content' => $data['content'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_concept_art_revisions']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function createProjectReferenceImage($data, $sort_order = 0)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_reference_images']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'project_id' => $data['project_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'content' => $data['content'],
                'sort_order' => $sort_order
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_reference_images']['select_by_id'],
            [
                'id' => $this->db->lastInsertId(),
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function createProjectLocation($data, $sort_order = 0)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_locations']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'project_id' => $data['project_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'content' => $data['content'],
                'sort_order' => $sort_order
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_locations']['select_by_id'],
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

    public function createProjectStoryboardPanel($data, $sortOrder = 0)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_storyboard_panels']['insert'],
            [
                'user_id' => $this->securityContext->id,
                'sort_order' => $sortOrder,
                'storyboard_id' => $data['storyboard_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'sort_order' => $sortOrder
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

    public function createProjectStoryboardPanelComment($data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['comments']['insert'],
            [
                'user_id' => $data['user_id'],
                'entity_id' => $data['panel_id'],
                'entity_table_name' => 'project_storyboard_panels',
                'comment' => $data['comment'],
                'status' => $data['status'],
                'date_added' => $data['date_added']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['comments']['get_by_id'],
            [
                'id' => $this->db->lastInsertId()
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

    public function updateProjectCharacter($id, $data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_characters']['update'],
            [
                'id' => $id,
                'project_id' => $data['project_id'],
                'user_id' => $this->securityContext->id,
                'name' => $data['name'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_characters']['select_by_id'],
            [
                'id' => $id,
                'user_id' => $this->securityContext->id
            ]
        );

        return $result;
    }

    public function updateProjectCharacterRevision($id, $data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['project_character_revisions']['update'],
            [
                'id' => $id,
                'character_id' => $data['character_id'],
                'user_id' => $this->securityContext->id,
                'content' => $data['content'],
                'description' => $data['description']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['project_character_revisions']['select_by_id'],
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
            $this->configs['sql']['project_characters']['update'],
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

    public function updateProjectStoryboardPanelComment($id, $data)
    {
        $result = $this->db->perform(
            $this->configs['sql']['comments']['update'],
            [
                'id' => $id,
                'user_id' => $data['user_id'],
                'comment' => $data['comment'],
                'status' => $data['status'],
                'date_added' => $data['date_added']
            ]
        );

        $result = $this->db->fetchOne(
            $this->configs['sql']['comments']['get_by_id'],
            [
                'id' => $id,
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

    public function fetchProjectUsers($projectId)
    {
        $user = $this->db->fetchOne(
            $this->configs['sql']['users']['get_by_id'],
            [
                'id' => $this->securityContext->id
            ]
        );

        $users = $this->db->fetchAll(
            $this->configs['sql']['project_users']['get_by_project'],
            [
                'project_id' => $projectId,
                'user_id' => $this->securityContext->id
            ]
        );

        $users = array_merge([$user], $users);
        return $users;
    }

    public function fetchCharacterById($characterId)
    {
        $character = $this->db->fetchOne(
            $this->configs['sql']['project_characters']['select_by_id'],
            [
                'id' => $characterId,
                'user_id' => $this->securityContext->id
            ]
        );

        return $character;
    }

    public function fetchCharacterRevisionById($revisionId)
    {
        $revision = $this->db->fetchOne(
            $this->configs['sql']['project_character_revisions']['select_by_id'],
            [
                'id' => $revisionId,
                'user_id' => $this->securityContext->id
            ]
        );

        return $revision;
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

    public function fetchStoryboardPanelCommentById($commentId)
    {
        $comment = $this->db->fetchOne(
            $this->configs['sql']['comments']['get_by_id'],
            [
                'id' => $commentId
            ]
        );

        return $comment;
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

    public function orderProjectCharacters($params)
    {
        foreach ($params['items'] as $id=>$order){
            if($order != "") {
                $retult = $this->db->perform(
                    $this->configs['sql']['project_characters']['update_order'],
                    [
                        'id' => $id,
                        'project_id' => $params['project_id'],
                        'sort_order' => $order,
                        'user_id' => $this->securityContext->id
                    ]
                );
            }
        }
    }

    public function orderProjectStoryboards($params)
    {
        foreach ($params['items'] as $id=>$order){
            if($order != "") {
                $retult = $this->db->perform(
                    $this->configs['sql']['project_storyboards']['update_order'],
                    [
                        'id' => $id,
                        'project_id' => $params['project_id'],
                        'sort_order' => $order,
                        'user_id' => $this->securityContext->id
                    ]
                );
            }
        }
    }

    public function orderProjectStoryboardPanels($params)
    {
        foreach ($params['items'] as $id=>$order){
            if($order != "") {
                $retult = $this->db->perform(
                    $this->configs['sql']['project_storyboard_panels']['update_order'],
                    [
                        'id' => $id,
                        'storyboard_id' => $params['storyboard_id'],
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

        $characters = $this->db->fetchAll(
            $this->configs['sql']['project_characters']['select_by_project'],
            [
                'project_id' => (int) $project['id'],
                'user_id' => $this->securityContext->id
            ]
        );

        foreach ($characters as $characterIdx=>$character) {
            $revisions = $this->db->fetchAll(
                $this->configs['sql']['project_character_revisions']['select_by_character'],
                [
                    'character_id' => (int) $character['id'],
                    'user_id' => $this->securityContext->id
                ]
            );
            $character['revisions'] = $revisions;
            $characters[$characterIdx] = $character;
        }

        $concept_art = $this->db->fetchAll(
            $this->configs['sql']['project_concept_art']['select_by_project'],
            [
                'project_id' => (int) $project['id'],
                'user_id' => $this->securityContext->id
            ]
        );

        foreach ($concept_art as $idx=>$art) {
            $revisions = $this->db->fetchAll(
                $this->configs['sql']['project_concept_art_revisions']['select_by_concept_art'],
                [
                    'concept_art_id' => (int) $art['id'],
                    'user_id' => $this->securityContext->id
                ]
            );
            $art['revisions'] = $revisions;
            $concept_art[$idx] = $art;
        }

        $locations = $this->db->fetchAll(
            $this->configs['sql']['project_locations']['select_by_project'],
            [
                'project_id' => (int) $project['id'],
                'user_id' => $this->securityContext->id
            ]
        );

        $reference_images = $this->db->fetchAll(
            $this->configs['sql']['project_reference_images']['select_by_project'],
            [
                'project_id' => (int) $project['id'],
                'user_id' => $this->securityContext->id
            ]
        );

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

                $comments = $this->db->fetchAll(
                    $this->configs['sql']['comments']['get_by_entity'],
                    [
                        'entity_id' => (int) $panel['id'],
                        'entity_table_name' => "project_storyboard_panels"
                    ]
                );

                $panel['comments'] = $comments;
                $panel['revisions'] = $revisions;
                $panels[$panelIdx] = $panel;

            }

            $storyboard['panels'] = $panels;
            $storyboards[$storyboardIdx] = $storyboard;
        }

        $owner = $this->db->fetchOne(
            $this->configs['sql']['users']['get_by_id'],
            [
                'id' => $this->securityContext->id
            ]
        );
        $users = $this->db->fetchAll(
            $this->configs['sql']['project_users']['get_by_project'],
            [
                'project_id' => $project['id'],
                'user_id' => $this->securityContext->id
            ]
        );
        $users = array_merge([$owner], $users);

        $project['characters'] = $characters;
        $project['concept_art'] = $concept_art;
        $project['locations'] = $locations;
        $project['reference_images'] = $reference_images;
        $project['storyboards'] = $storyboards;
        $project['users'] = $users;

        return $project;
    }


}
