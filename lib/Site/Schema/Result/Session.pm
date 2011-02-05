package Site::Schema::Result::Session;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

Site::Schema::Result::Session

=cut

__PACKAGE__->table("sessions");

=head1 ACCESSORS

=head2 uid

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=head2 sessionkey

  data_type: 'text'
  is_nullable: 1
  original: {data_type => "varchar"}

=head2 expires

  data_type: 'timestamp with time zone'
  default_value: (now() + '01:00:00'::interval)
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "uid",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
  "sessionkey",
  {
    data_type   => "text",
    is_nullable => 1,
    original    => { data_type => "varchar" },
  },
  "expires",
  {
    data_type     => "timestamp with time zone",
    default_value => \"(now() + '01:00:00'::interval)",
    is_nullable   => 0,
  },
);
__PACKAGE__->set_primary_key("uid");
__PACKAGE__->add_unique_constraint("sessions_sessionkey_key", ["sessionkey"]);

=head1 RELATIONS

=head2 uid

Type: belongs_to

Related object: L<Site::Schema::Result::User>

=cut

__PACKAGE__->belongs_to(
  "uid",
  "Site::Schema::Result::User",
  { uid => "uid" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2011-02-05 17:45:39
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:3iO9RlTnU+keTOu1GtqM0A


# You can replace this text with custom content, and it will be preserved on regeneration
1;
