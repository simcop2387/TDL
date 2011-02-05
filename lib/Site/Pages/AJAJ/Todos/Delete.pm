package Site::Pages::AJAJ::Todos::Delete;
use strictures 1;

use base qw/ Site::Pages /;
use Site::Utils;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();

  my $data = $self->get_json('data');
  my $id = $data->{id};

  $self->schema->resultset('Todo')->find({tid => $id})->delete();
}