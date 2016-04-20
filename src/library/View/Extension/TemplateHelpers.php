<?php
use xrstf\Fountain\Parser;
use Cocur\Slugify\Slugify;

class TemplateHelpers extends \Twig_Extension
{
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('date_format', array($this, 'date_format')),
            new \Twig_SimpleFilter('print_r', array($this, 'print_r')),
            new \Twig_SimpleFilter('json_encode', array($this, 'json_encode')),
            new \Twig_SimpleFilter('strip_tags', array($this, 'strip_tags')),
            new \Twig_SimpleFilter('fountain', array($this, 'fountain')),
            new \Twig_SimpleFilter('to_array', array($this, 'to_array')),
            new \Twig_SimpleFilter('slugify', array($this, 'slugify')),
            new \Twig_SimpleFilter('url_hostname', array($this, 'url_hostname')),
            new \Twig_SimpleFilter('md5', array($this, 'md5'))
        );
    }
    public function date_format($date, $format = "F j, Y g:i:a")
    {
        // echo $date; die();
        return date($format, strtotime($date));
    }
    public function print_r($output)
    {
        return print_r($output,1);
    }
    public function strip_tags($html)
    {
        return strip_tags($html);
    }
    public function json_encode($output)
    {
        return json_encode($output);
    }
    public function fountain($output)
    {
        $parser = new Parser();
        return $parser->parse($output);
    }
    public function md5($output)
    {
        return md5($output);
    }
    public function url_hostname($url)
    {
        return parse_url($url, PHP_URL_HOST);
    }
    public function to_array($stdClassObject) {
        return json_decode(json_encode($stdClassObject), true);
    }
    public function slugify($str) {
        $slugify = new Slugify();
        return $slugify->slugify($str);
    }
    public function getName()
    {
        return 'acme_extension';
    }
}
