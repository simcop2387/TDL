package Site::Pages::AJAJ::Todos::Delete;
use strictures 1;

use base qw/ Site::Pages::JSON /;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();
  
  my $data = $self->get_json();
  my ($id) = $data->{id};
  
  if (my $todo = $self->schema->resultset('Todo')->find({tid => $id})) {
    $todo->delete();
    return $self->json_success;
  } else {
    return $self->json_failure;
  }
}

1;