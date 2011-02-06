package Site::Pages::AJAJ::Lists::New;
use strictures 1;

use base qw/ Site::Pages::JSON /;

# TODO make this send back the new ID and have use make a new one, this will enable multiple sessions for a user later

sub handle_POST {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();
  my $data = $self->get_json();
  my $id = $data->{id};

  # failure if we do have one
  unless ($self->schema->resultset('List')->find({uid => $uid, lid => $id})) {
    my $newhash;

    for (qw/title/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }
    $newhash->{lid} = $id; # carry the id over

    $self->schema->resultset('List')->create($newhash);

    return $self->json_success;
  } else {
    return $self->json_failure;
  }
}

1;