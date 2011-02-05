package Site::Pages::AJAJ::Lists;
use strictures 1;

use Site::Utils;

sub new {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        my $uid = unroll_session ( $req );
        my $title = $req->param( 'title' );
        my $id    = $req->param( 'id' ); # we trust the client to make a new id, but we'll send an error back if it doesn't work
          
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
        my $title = $req->param( 'title' );
        my $id    = $req->param( 'id' ); # we trust the client to make a new id, but we'll send an error back if it doesn't work

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
        my $title = $req->param( 'title' );
        my $id    = $req->param( 'id' ); # we trust the client to make a new id, but we'll send an error back if it doesn't work

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
        my $title = $req->param( 'title' );
        my $id    = $req->param( 'id' ); # we trust the client to make a new id, but we'll send an error back if it doesn't work

    }

    return http_method_not_allowed( $res );
}

1;
