package Site::Pages::Main;
use strictures 1;
use base qw/ Site::Pages /;

sub handle_GET {
    my ( $self ) = @_;

    $self->res->header( 'x-sendfile' => $self->config->{'paths'}->{'static_files'} . "/basicui.html" );
    return $self->res;
}

1;
