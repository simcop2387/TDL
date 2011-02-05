package Site::Pages::AJAJ::Lists;
use strictures 1;

use Site::Utils;

sub new {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        if (my $uid = get_session( $req )) { # do we have a valid uid/session?
          my $title = $req->param( 'title' );
          my $id    = $req->param( 'id' ); # we trust the client to make a new id, but we'll send an error back if it doesn't work
          
        } else {
          # not a valid session, tell them it's a bad request and nothing more
          $res->status(400);
          return $res;
        }
    }
    
    return http_method_not_allowed( $res );
}

sub edit {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        if (my $uid = get_session( $req )) { # do we have a valid uid/session?
          my $title = $req->param( 'title' );
          my $id    = $req->param( 'id' ); # we trust the client to make a new id, but we'll send an error back if it doesn't work

        } else {
          # not a valid session, tell them it's a bad request and nothing more
          $res->status(400);
          return $res;
        }
    }

    return http_method_not_allowed( $res );
}

sub order {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        if (my $uid = get_session( $req )) { # do we have a valid uid/session?
          my $title = $req->param( 'title' );
          my $id    = $req->param( 'id' ); # we trust the client to make a new id, but we'll send an error back if it doesn't work

        } else {
          # not a valid session, tell them it's a bad request and nothing more
          $res->status(400);
          return $res;
        }
    }

    return http_method_not_allowed( $res );
}

sub delete {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'POST' ) {
        # Handle Post
        if (my $uid = get_session( $req )) { # do we have a valid uid/session?
          my $title = $req->param( 'title' );
          my $id    = $req->param( 'id' ); # we trust the client to make a new id, but we'll send an error back if it doesn't work

        } else {
          # not a valid session, tell them it's a bad request and nothing more
          $res->status(400);
          return $res;
        }
    }

    return http_method_not_allowed( $res );
}

1;
