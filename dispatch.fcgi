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
use Site::Pages::AJAJ::Lists::New;
use Site::Pages::AJAJ::Lists::Edit;
use Site::Pages::AJAJ::Lists::Order;
use Site::Pages::AJAJ::Lists::Delete;

use Site::Pages::AJAJ::Todos::New;
use Site::Pages::AJAJ::Todos::Edit;
use Site::Pages::AJAJ::Todos::Order;
use Site::Pages::AJAJ::Todos::Delete;

use Site::Pages::AJAJ::Login;
use Site::Pages::AJAJ::GetData;
use Site::Pages::AJAJ::Register;

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
    {
      quote_char => '"',
    },
);

####### Global Heap ########
$Site::heap{'schema'} = $schema;
$Site::heap{'config'} = $config;

my $app = Site::Dispatch->new(
    [
        { url => qr|^/$|,        package => "Site::Pages::Main" }, # main site, really just a version of static but without the filename
        { url => qr|^/static/|, package => "Site::Pages::Static", test => \&Site::Pages::Static::can_send  },
        # misc methods
        { url => qr|^/ajaj/login|,   package => "Site::Pages::AJAJ::Login"   },
        { url => qr|^/ajaj/logout$|,  package => "Site::Pages::AJAJ::Logout",  test => \&Site::Util::test_session },
        { url => qr|^/ajaj/getdata$|, package => "Site::Pages::AJAJ::GetData", test => \&Site::Util::test_session },
        { url => qr|^/ajaj/register$|,package => "Site::Pages::AJAJ::Register" },
        # list manipulation pages
        { url => qr|^/ajaj/list/new$|,    package => "Site::Pages::AJAJ::Lists::New",    test => \&Site::Util::test_session   },
        { url => qr|^/ajaj/list/edit$|,   package => "Site::Pages::AJAJ::Lists::Edit",   test => \&Site::Util::test_session   },
        { url => qr|^/ajaj/list/order$|,  package => "Site::Pages::AJAJ::Lists::Order",  test => \&Site::Util::test_session   },  # this is the order of the lists themselves, not the content
        { url => qr|^/ajaj/list/delete$|, package => "Site::Pages::AJAJ::Lists::Delete", test => \&Site::Util::test_session   },
        # todo manipulation pages
        { url => qr|^/ajaj/todo/new$|,    package => "Site::Pages::AJAJ::Todos::New",    test => \&Site::Util::test_session   },
        { url => qr|^/ajaj/todo/edit$|,   package => "Site::Pages::AJAJ::Todos::Edit",   test => \&Site::Util::test_session   },
        { url => qr|^/ajaj/todo/order$|,  package => "Site::Pages::AJAJ::Todos::Order",  test => \&Site::Util::test_session   }, # this isn't REALLY an order on the todo, but the list the todo is on
        { url => qr|^/ajaj/todo/delete$|, package => "Site::Pages::AJAJ::Todos::Delete", test => \&Site::Util::test_session   },

        # this just redirects to / we don't have a real 404
        #{ url => qr|^/|,            package => "Site::Pages::404"  },
    ],
);

$app = Plack::Middleware::ContentLength->wrap($app);
$app = Plack::Middleware::LighttpdScriptNameFix->wrap($app);
$app = Plack::Middleware::GuessContentType->wrap($app);
