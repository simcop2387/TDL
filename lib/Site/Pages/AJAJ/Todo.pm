package Site::Pages::AJAJ::Todo;
use strictures 1;

use Site::Utils;

sub new {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        my $uid = unroll_session ( $req );
        my ($id, $title, $due, $list, $desc) =
          get_params(qw/id title due list desc/);
        #my $desc  = $req->param( 'desc' ); # not used yet
        
    }

    return http_method_not_allowed( $res );
}

sub edit {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        my $uid = unroll_session ( $req );
        my ($id, $title, $due, $list, $desc) =
          get_params(qw/id title due list desc/);
    }

    return http_method_not_allowed( $res );
}

sub order {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        my $uid = unroll_session ( $req );
        my $order = $req->param( 'order' ); # we get a list of "todo_\d+"

    }

    return http_method_not_allowed( $res );
}

sub delete {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        my $uid = unroll_session ( $req );
        my $id    = $req->param( 'id' );
        #
    }

    return http_method_not_allowed( $res );
}

1;
