<?php

use JsonSchema\Validator as JsonSchemaValidator;

class Validator {

    protected $validator;

    public function __construct()
    {
        $this->validator = new JsonSchemaValidator();
    }

    private function filter($data)
    {
        foreach ($data as $key=>$value){
            if ($value == "") {
                $data->$key = null;
            }
            if((int) $value > 0) {
                $data->$key = (int) $value;
            }
        }
        return $data;
    }

    public function validate($data, $json_schema_filename)
    {
        $schema = json_decode(
            file_get_contents(realpath($json_schema_filename)));
        $this->validator->check($this->filter($data), $schema);
        if(!$this->validator->isValid()) {
            return $this->validator->getErrors();
        }
        return null;
    }

}
