<?php

class Project extends ActiveRecord\Model
{
    static $table_name = 'projects';

    static $before_create = array('before_create_audit');
    static $before_save = array('before_save_audit');

    public function before_create_audit() {
        $this->date_added = date('Y-m-d g:i:s a');
        $this->date_updated = date('Y-m-d g:i:s a');
    }

    public function before_save_audit() {
        $this->date_updated = date('Y-m-d g:i:s a');
    }

    public function to_json(array $options=array()) {
        $model = json_decode(parent::to_json($options));
        $model->characters = [];
        $model->storyboards = [];
        $model->concept_art = [];
        $model->reference_images = [];
        $model->locations = [];
        $model->users = [];

        # characters
        $_characters = ProjectCharacter::find_all_by_project_id(
            $model->id, [
                'order' => 'sort_order'
            ]);

        foreach ($_characters as $_character) {
            $model->characters[] = json_decode($_character->to_json());
        }

        # storyboards
        $_storyboards = ProjectStoryboard::find_all_by_project_id(
            $model->id, [
                'order' => 'sort_order'
            ]);

        foreach ($_storyboards as $_storyboard) {
            $model->storyboards[] = json_decode($_storyboard->to_json());
        }

        # concept art
        $_concept_arts = ProjectConceptArt::find_all_by_project_id(
            $model->id, [
                'order' => 'sort_order'
            ]);

        foreach ($_concept_arts as $_concept_art) {
            $model->concept_art[] = json_decode($_concept_art->to_json());
        }

        # reference images
        $_reference_images = ProjectReferenceImage::find_all_by_project_id(
            $model->id, [
                'order' => 'sort_order'
            ]);

        foreach ($_reference_images as $_reference_image) {
            $model->reference_images[] = json_decode($_reference_image->to_json());
        }

        # locations
        $_locations = ProjectLocation::find_all_by_project_id(
            $model->id, [
                'order' => 'sort_order'
            ]);

        foreach ($_locations as $_location) {
            $model->locations[] = json_decode($_location->to_json());
        }

        # project users
        $_users = [];
        $_users[] = User::find_by_id($model->user_id);

        $_project_users = ProjectUser::find_all_by_project_id($model->id);
        foreach($_project_users as $_project_user) {
            $_users[] = User::find_by_id($_project_user->project_user_id);
        }

        foreach ($_users as $_user) {
            $model->users[] = json_decode($_user->to_json([
                'except' => ['auth_token', 'password', 'app_user', 'notifications']
            ]));
        }


        return json_encode($model);
    }
}
