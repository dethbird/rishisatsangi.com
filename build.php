<?php

// print_r($argv);
$options = array();
if(count($argv)>1) {
  foreach($argv as $i=>$a) {
    if($i>0) {
      $option = explode("=", $a);
      $options[$option[0]]=$option[1];
    }
  }
}

print_r($options);

// cache
if($options['cache']!="") {
  echo "cache:".$options['cache']."\n";
  shell_exec("rm -rf cache");
  shell_exec("mkdir cache");
  shell_exec("chmod 777 cache");
}

// php and composer
if($options['php']!="") {
  echo "php:".$options['php']."\n";
  shell_exec("rm -rf vendor");
  shell_exec("rm -rf composer.lock");
  shell_exec("curl -sS https://getcomposer.org/installer | php");
  shell_exec("php composer.phar install");
  shell_exec("rm -rf composer.phar");
}

// javascript
if($options['js']!="") {
  echo "js:".$options['js']."\n";
  $frontendFiles = explode("\n", shell_exec("find src/frontend/js/pages/ -name '*.js'"));
  foreach($frontendFiles as $file){
    if($file) {
      $outputFile = str_replace("src/frontend", "public", $file);
      echo $outputFile."\n";
      $output = shell_exec("browserify ".$file." -o ".$outputFile);
      if($options['js']!="dev"){
        $output = shell_exec("uglifyjs ".$outputFile." -o ".$outputFile);
      }
    }
  }
}
