drop table towns;
drop table regNumbers

create table town(
    id serial not null primary key,
    townName text not null unique,
)

create table regNumbers(
    id serial not null primary key,
    regNumber text not null unique,
    town_id int,
	foreign key (town_id) references town(id)
)