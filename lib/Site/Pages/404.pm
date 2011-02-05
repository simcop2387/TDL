package Site::Pages::404;
use strictures 1;
use base qw/ Site::Pages /;

sub handle_GET {
    my ( $self ) = @_;

    $self->res->status(404);
    $self->res->headers({ 'Content-Type' => 'text/html', 'Refresh' => '1; URL=/' });
    $self->res->body( '<meta http-equiv="Refresh" content="1; URL=/"> Permanently relocated to /' );
    return $self->self->res;
}

1;
