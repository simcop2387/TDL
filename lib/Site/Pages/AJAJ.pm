package Site::Pages::Edit;
use strictures 1;

use Site::Utils;

sub get_data {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    my $content;

    if ( $con eq 'GET' ) {
        # Handle Get
    }

    return http_method_not_allowed($res);
}

1;
