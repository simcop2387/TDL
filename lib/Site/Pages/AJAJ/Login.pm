package Site::Pages::AJAJ::Login;
use strictures 1;

use base qw/ Site::Pages /;

sub handle_POST {
  my ( $self ) = @_;

  my ($username, $passhash) = $self->get_params(qw/username passhash/);

}

sub make_session {
  my ($username) = @_;
}
