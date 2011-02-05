package Site::Pages::Static;
use strictures 1;
use base qw/ Site::Pages /;

sub can_send {
    my ( $req ) = @_;
    my ( $res, $con, $uri ) = get_request_info( $req );
    $uri =~ s|^/static||; # remove /static, extra / doesn't matter
    
    return 0 if $uri =~ /\.\./;
    return 0 unless -e $Site::heap{'config'}->{'paths'}->{'static_files'} . $uri;
    return 1;
}

sub handle_GET {
    my ( $self ) = @_;
    my $path = $self->req->path; # i'm going to filter it for this project
    $path =~ s|^/static||; # remove my /static, extra / doesn't matter

    warn "TESTING: $path\n";

    $self->res->header( 'x-sendfile' => $self->config->{'paths'}->{'static_files'} . $path );
    return $self->res;
}


1;
