#!/usr/bin/perl
use strictures 1;
use lib 'lib';

####### External Libs ########
use Plack::Middleware::ContentLength;
use Plack::Middleware::LighttpdScriptNameFix;
use Plack::Middleware::GuessContentType;
use Plack::Request;

####### Internal Libs ########
use Site;           # Heap + General Stuff
use Site::Dispatch; # Custom Dispatch Table Loader
use Site::Schema;   # DBIC
use Site::Config;   # YAML + Conf Validator

## Page Handlers ##
use Site::Pages::AJAX;
use Site::Pages::Static;

####### Conf/DB Setup ########
my $config = Site::Config->load_config( 'conf/development.yaml' );

my $schema = Site::Schema->connect( 
    "dbi:Pg:host=" . $config->{database}->{hostname} .
    ";dbname=" . $config->{database}->{database}, 
    $config->{database}->{username}, 
    $config->{database}->{password},
);

####### Global Heap ########
$Site::heap{'schema'} = $schema;
$Site::heap{'config'} = $config;

my $app = Site::Dispatch->new(
    [
        { url => qr|^/ajax/$|,   call => \&Site::Pages::AJAX::handle   },
        { url => qr|^.*$|,       call => \&Site::Pages::Static::handle, test => \&Site::Pages::Static::can_send },
    ],
);

$app = Plack::Middleware::ContentLength->wrap($app);
$app = Plack::Middleware::LighttpdScriptNameFix->wrap($app);
$app = Plack::Middleware::GuessContentType->wrap($app);
