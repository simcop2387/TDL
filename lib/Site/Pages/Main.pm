package Site::Pages::Main;
use strictures 1;
use base qw/ Site::Pages /;

sub handle_GET {
    my ( $self ) = @_;
    if ( $self->config->{'server'}->{'x_send_file'} ) {
        $self->res->header( 'x-sendfile' => $self->config->{'paths'}->{'static_files'} . "/basicui.html" );
        return $self->res;
    }
}


1;
