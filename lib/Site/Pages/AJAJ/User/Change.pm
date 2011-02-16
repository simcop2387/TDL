package Site::Pages::AJAJ::User::Change;
use strictures 1;

use base qw/ Site::Pages::JSON /;

use Try::Tiny;

sub handle_POST {
  my ( $self ) = @_;
  my ( $uid ) = $self->unroll_session();

  my $data = $self->get_json();
  my $newhash;

  if (my $row = $self->schema->resultset('User')->find({uid => $uid})) {
    my $newhash;

    for (qw/email password/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }

    try {
      $row->update($newhash);
      return $self->json_success(data => $newhash);
    } catch {
      return $self->json_failure(message => "$_");
    }
  } else {
    return $self->json_failure;
  }
}

1;