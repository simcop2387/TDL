package Site::Pages::AJAJ::Todos::Edit;
use strictures 1;

use base qw/ Site::Pages::JSON /;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();

  my $data = $self->get_json();
  my $id = $data->{id};
  my $newhash;

  if (my $list=$self->schema->resultset('Todo')->find({uid => $uid, tid => $id})) {
    my $newhash;
    
    for (qw/title due description lid order/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }
    $list->update($newhash);

    return $self->json_success;
  } else {
    return $self->json_failure;
  }
}

1;