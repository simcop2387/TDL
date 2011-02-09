package Site::Pages::AJAJ::Register;
use strictures 1;

use base qw/ Site::Pages::JSON /;
use Site::Session;

sub handle_POST {
  my ( $self ) = @_;

  # TODO: change this system to be more secure
  # Ideally i'd like to use a challenge response instead but this will suffice for now

  my $data = $self->get_json();
  my ($username, $passhash, $email) = @{$data}{qw/username password email/}; # for future

  unless ($self->schema->resultset('User')->find({username => $username})) {
    my $row = $self->schema->resultset('User')->create({username => $username, password=>$passhash, email => $email});
    my $uid = $row->uid; # should have a uid here, can only get one row from the database due to constraints

    create_session ( $uid, $self->req, $self->res );

    return $self->json_success;
  } else {
    return $self->json_failure(message => "Username $username is in use");
  }
}

1;
