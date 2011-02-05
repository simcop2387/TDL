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
use Site::Pages::AJAJ::Lists;
use Site::Pages::AJAJ::Todo;
use Site::Pages::404;

use Site::Pages::Main;

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
        { url => qr|^/|,        call => \&Site::Pages::Main::handle }, # main site
        { url => qr|^/static/|, call => \&Site::Pages::Static::handle  },
        # misc methods
        { url => qr|^/ajaj/login$|,   call => \&Site::Pages::Login::handle   },
        { url => qr|^/ajaj/getdata$|, call => \&Site::Pages::AJAJ::getdata   },
        # list manipulation pages
        { url => qr|^/ajaj/list/new$|,    call => \&Site::Pages::AJAJ::Lists::new   },
        { url => qr|^/ajaj/list/edit$|,   call => \&Site::Pages::AJAJ::Lists::edit   },
        { url => qr|^/ajaj/list/order$|,  call => \&Site::Pages::AJAJ::Lists::order   },  # this is the order of the lists themselves, not the content
        { url => qr|^/ajaj/list/delete$|, call => \&Site::Pages::AJAJ::Lists::delete   },
        # todo manipulation pages
        { url => qr|^/ajaj/todo/new$|,    call => \&Site::Pages::AJAJ::Todo::new   },
        { url => qr|^/ajaj/todo/edit$|,   call => \&Site::Pages::AJAJ::Todo::edit   },
        { url => qr|^/ajaj/todo/order$|,  call => \&Site::Pages::AJAJ::Todo::order   }, # this isn't REALLY an order on the todo, but the list the todo is on
        { url => qr|^/ajaj/todo/delete$|, call => \&Site::Pages::AJAJ::Todo::delete   },

        # this just redirects to / we don't have a real 404
        { url => qr||,            call => \&Site::Pages::404::handle  },
    ],
);

$app = Plack::Middleware::ContentLength->wrap($app);
$app = Plack::Middleware::LighttpdScriptNameFix->wrap($app);
$app = Plack::Middleware::GuessContentType->wrap($app);
