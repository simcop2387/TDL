package Site::Pages::404;
use strictures 1;

use Site::Utils;

sub handle {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );

    if ( $con eq 'GET' ) {
        $res->status(404);
        $res->headers({ 'Content-Type' => 'text/html', 'Refresh' => '1; URL=/' });
        $res->body( '<meta http-equiv="Refresh" content="1; URL=/"> Permanently relocated to /' );
        return $res;
    }

    return http_method_not_allowed( $res );
}

1;
