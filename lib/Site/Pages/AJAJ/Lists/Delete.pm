package Site::Pages::AJAJ::Lists::Delete;
use strictures 1;

use base qw/ Site::Pages::JSON /;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();

  my $data = $self->get_json();
  my ($id) = $data->{id};

  if (my $list = $self->schema->resultset('List')->find({lid => $id})) {
    $list->delete();
    return $self->json_success;
  } else {
    return $self->json_failure;
  }
}

1;