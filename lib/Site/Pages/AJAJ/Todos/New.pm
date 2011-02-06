package Site::Pages::AJAJ::Todos::New;
use strictures 1;

use base qw/ Site::Pages::JSON /;

sub handle_POST {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();
  my $data = $self->get_json();
  my $id = $data->{id};

  # failure if we do have one
  unless ($self->schema->resultset('Todo')->find({uid => $uid, lid => $id})) {
    my $newhash;

    for (qw/title due description/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }
    $newhash->{tid} = $id; # carry the id over

    $self->schema->resultset('Todo')->create($newhash);

    return $self->json_success;
  } else {
    return $self->json_failure;
  }
}

1;