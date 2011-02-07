Things Done Later
=====

What Is Things Done Later?
-------------

Things Done Later is a simple AJAXy Task Tracking webapp written in Perl based on
DBIx::Class, Plack::Request, with a bit of my own magic stolen from Kona
in.  Its primary reason for existing is that someone thought it would be fun to make.

Features
---------

* Dynamic UI using Jquery UI
* Secure Challenge-Response login system using HMAC-SHA256

Todo
---------

* Switch to PKBDF2-HMAC-SHA256 for logins
* Allow for more details on each task, to the point of having sub-tasks
* Create a tutorial for new users

Depedencies
-------------

### Programs
* PostgreSQL
    It will ONLY work with PostgreSQL, I use some of it's date and time features
* lighttpd
* Perl

### CPAN Modules

> this may be wrong; I haven't verified everything yet

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
* Moose
* Moo
* Digest::HMAC
* Digest::SHA

Installation
--------------

1. Install depedencies.  To install the CPAN Modules, I recommend cpanminus.
1. Configure PostgreSQL:
    1. Create a user and database.
    1. Edit configuration in conf/development.yaml to include authentication credentials.
    1. Run tools/setup_db -c conf/development.yaml
1. Configure lighttpd based on the configuration file conf/lighttpd.conf
1. Edit dispatch.fcgi to point it to the conf/development.yaml if it isn't already
1. Run the app via command: plackup -s FCGI -l 127.0.0.1:8080 dispatch.fcgi

Authors
---------
* [Ryan Voots](http://www.simcop2387.info/) -- HTML/CSS/JS + business logic
* [SymKat](http://symkat.com/) -- Excelent framework stolen from Kona
