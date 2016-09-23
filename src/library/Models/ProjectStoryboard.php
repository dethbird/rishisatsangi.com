<?php

class ProjectStoryboard extends ActiveRecord\Model
{
    static $table_name = 'project_storyboards';

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
        $model->panels = [];

        # panels
        $_panels = ProjectStoryboardPanel::find_all_by_storyboard_id(
            $model->id, [
                'order' => 'sort_order'
            ]);

        foreach ($_panels as $_panel) {
            $model->panels[] = json_decode($_panel->to_json());
        }

        return json_encode($model);
    }

}
