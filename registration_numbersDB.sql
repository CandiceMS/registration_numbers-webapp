drop table towns;
drop table reg_numbers

create table towns(
    id serial not null primary key,
    town_name text not null unique,
)

create table reg_numbers(
    id serial not null primary key,
    reg_number text not null unique,
    town_id int,
	foreign key (town_id) references town(id)
)