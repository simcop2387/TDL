package Site::Pages::AJAJ::Lists::New;
use strictures 1;

use base qw/ Site::Pages::JSON /;
use Data::Dumper;

# TODO make this send back the new ID and have use make a new one, this will enable multiple sessions for a user later

use Try::Tiny;
use JSON::XS;

sub handle_POST {
  my ( $self ) = @_;
  
  my ( $uid ) = $self->unroll_session();
  my $data = $self->get_json();
  #INSERT INTO lists (uid, lid, title, "order") VALUES (2, getnextlid(2), 'arguments', getnextlid(2));
  # failure if we do have one\
  
  try {
    my $newhash;

    for (qw/title/) { # only allow what we want
      $newhash->{$_} = $data->{$_} if exists($data->{$_});
    }
    $newhash->{uid} = $uid;
    $newhash->{lid} = \[qq[getnextlid($uid)]]; # carry the id over, possible injection if someone can figure out how to set their uid to something other than an integer
    
    $self->schema->resultset('List')->create($newhash);
    my $row = $self->schema->resultset('List')->find({uid => $uid, lid => \[qq[ = getnextlid($uid) - 1]]}); # TODO find a saner way to deal with this, probably using a serial on the database from now on

    my $lid = $row->get_column('lid');
    return $self->json_success(lid => "$lid", DD=>Dumper($lid));
  } catch {
    return $self->json_failure(message => "$_");
  }
}

1;