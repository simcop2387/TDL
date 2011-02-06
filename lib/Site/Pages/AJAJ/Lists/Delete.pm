package Site::Pages::AJAJ::Lists::Delete;
use strictures 1;

use base qw/ Site::Pages::JSON /;
use Try::Tiny;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();

  my $data = $self->get_json();
  my ($lid) = $data->{lid};

  try {
    $self->schema->resultset('List')->find({lid => $lid})->delete();
    return $self->json_success;
  } catch {
    return $self->json_failure(message => "$_");
  }
}

1;