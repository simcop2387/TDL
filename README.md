$NAME
=====

What Is $NAME
-------------

$NAME is a simple AJAXy Task Tracking webapp written in Perl based on
DBIx::Class, Plack::Request, with a bit of my own magic stolen from Kona
in.  Its primary reason for existing is that someone thought it would be fun to make.

$NAME?
----------

Its name got based on this conversation:

    <simcop2387>  What should I call it?
    <Someoneelse>  I don't know you haven't asked me yet

Depedencies
-------------

### Programs
* PostgreSQL
    It will ONLY work with PostgreSQL, I use some of it's date and time features
* lighttpd
* Perl

### CPAN Modules
> this may be wrong, copied from Kona and i haven't verified everything yet
* strictures
* indirect
* Template
* DBIx::Class
* DBIx::Class::Schema::Loader
* DBIx::Class::TimeStamp
* DBD::Pg
* Plack
* DateTime
* DateTime::Format::Pg
* File::MMagic
* FCGI::ProcManager

Installation
--------------

1. Install depedencies.  To install the CPAN Modules, I recommend cpanminus.
1. Configure PostgreSQL:
    > This  will change, I will be using ... to deploy based off the schema itself.
    1. Create a user and database.
    1. Import conf/sql/schema-*.sql;
    1. Edit configuration in conf/development.yaml to include authentication credentials.
1. Configure lighttpd based on the configuration file conf/lighttpd.conf
1. Run the app via command: plackup -s FCGI -l 127.0.0.1:8080 dispatch.fcgi

Authors
---------
* [Ryan Voots](http://www.simcop2387.info/) -- HTML/CSS/JS + business logic
* [SymKat](http://symkat.com/) -- Excelent framework stolen from Kona