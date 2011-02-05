package Site::Utils;
use strictures 1;
use Template;

require Exporter;
our @ISA = qw/ Exporter /;
our @EXPORT = qw/get_params get_request_info get_template http_method_not_allowed http_redirect test_session unroll_session/;


my $template = Template->new(
    {
        INCLUDE_PATH =>'templates/',
        WRAPPER => 'wrapper.tt2',
        INTERPOLATE => 0,
        POST_CHOMP => 1,
        EVAL_PERL => 1,
    },
);

sub get_request_info {
    my ( $req ) = @_;

    my $res = $req->new_response(200);
    my $con = $req->method();
    my $uri = URI->new($req->request_uri());
   
    return ( $res, $con, $uri );
}

sub get_template {
    return $template;
}

###### HTTP Request Helpers

sub http_method_not_allowed {
    my ( $res ) = @_;
    $res->status(405);
    $res->body( "Method Not Allowed" );
    return $res;
}

sub http_redirect {
    my ($res, $where) = @_;
    $res->status(302);
    $res->headers({ Location => $where });
    $res->body( "Permanently relocated to $where" );
    return $res;
}

sub test_session {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );

    # todo check the session

    #return 0 if $uri =~ /\.\./;
    return 1;
}

1;
