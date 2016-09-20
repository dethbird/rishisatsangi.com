<?php

class ProjectStoryboardPanel extends ActiveRecord\Model
{
    static $table_name = 'project_storyboard_panels';

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
        $model->revisions = [];
        $model->comments = [];

        # revisions
        $_revisions = ProjectStoryboardPanelRevision::find_all_by_panel_id(
            $model->id, [
                'order' => 'sort_order'
            ]);

        foreach ($_revisions as $_revision) {
            $model->revisions[] = json_decode($_revision->to_json());
        }

        # comments
        $_comments = Comment::all(
            [
                'conditions' => [
                    'entity_id = ? and entity_table_name = "project_storyboard_panels"',
                    $model->id
                ],
                'order' => 'date_added DESC'
            ]
        );

        foreach ($_comments as $_comment) {
            $model->comments[] = json_decode($_comment->to_json());
        }

        return json_encode($model);
    }

}
