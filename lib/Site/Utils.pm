package Site::Utils;
use strictures 1;
use Template;

use Site;

require Exporter;
our @ISA = qw/ Exporter /;
our @EXPORT = qw/get_params get_request_info get_template http_method_not_allowed http_redirect test_session extend_session/;

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

###### Session helpers

sub test_session {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );

    # todo check the session

    #return 0 if $uri =~ /\.\./;
    return 1;
}

#i might make this unneccesary, can't decide
sub extend_session {
  my ( $uid )= @_;
  
  # this will only work in POSTGRES. i don't care about being agnostic right now.
  $Site::heap{schema}->resultset('Session')->find({uid => $uid})
    ->update({expires => \[q[NOW() + interval '1 hour']]});
}

1;
