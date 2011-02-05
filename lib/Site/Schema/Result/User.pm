package Site::Schema::Result::User;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->load_components("InflateColumn::DateTime");

=head1 NAME

Site::Schema::Result::User

=cut

__PACKAGE__->table("users");

=head1 ACCESSORS

=head2 uid

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0
  sequence: 'users_uid_seq'

=head2 username

  data_type: 'text'
  is_nullable: 0
  original: {data_type => "varchar"}

=head2 email

  data_type: 'text'
  is_nullable: 1
  original: {data_type => "varchar"}

=head2 password

  data_type: 'text'
  is_nullable: 0
  original: {data_type => "varchar"}

=cut

__PACKAGE__->add_columns(
  "uid",
  {
    data_type         => "integer",
    is_auto_increment => 1,
    is_nullable       => 0,
    sequence          => "users_uid_seq",
  },
  "username",
  {
    data_type   => "text",
    is_nullable => 0,
    original    => { data_type => "varchar" },
  },
  "email",
  {
    data_type   => "text",
    is_nullable => 1,
    original    => { data_type => "varchar" },
  },
  "password",
  {
    data_type   => "text",
    is_nullable => 0,
    original    => { data_type => "varchar" },
  },
);
__PACKAGE__->set_primary_key("uid");
__PACKAGE__->add_unique_constraint("users_email_key", ["email"]);
__PACKAGE__->add_unique_constraint("users_username_key", ["username"]);

=head1 RELATIONS

=head2 lists

Type: has_many

Related object: L<Site::Schema::Result::List>

=cut

__PACKAGE__->has_many(
  "lists",
  "Site::Schema::Result::List",
  { "foreign.uid" => "self.uid" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 todos

Type: has_many

Related object: L<Site::Schema::Result::Todo>

=cut

__PACKAGE__->has_many(
  "todos",
  "Site::Schema::Result::Todo",
  { "foreign.uid" => "self.uid" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2011-02-04 19:03:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:vFdytmFUX9hmG1cEKAkhRg


# You can replace this text with custom content, and it will be preserved on regeneration
1;
