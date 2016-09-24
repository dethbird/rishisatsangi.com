<?php

class Comment extends ActiveRecord\Model
{
    static $table_name = 'comments';

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
        $user = User::find_by_id($model->user_id);
        $model->user = json_decode($user->to_json([
            'except' => ['auth_token', 'password', 'app_user', 'notifications']
        ]));
        return json_encode($model);
    }
}
