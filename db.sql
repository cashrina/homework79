create schema items collate utf8mb4_general_ci;
use items;

create table category
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null
);

create table location
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null
);

create table products
(
    id          int auto_increment
        primary key,
    name        varchar(255)                       not null,
    category_id int                                not null,
    location_id int                                not null,
    description text                               null,
    photo       varchar(255)                       null,
    date        datetime default CURRENT_TIMESTAMP null,
    constraint products_category_id_fk
        foreign key (category_id) references category (id),
    constraint products_location_id_fk
        foreign key (location_id) references location (id)
);


INSERT INTO location (name, description) VALUES ('Офис #1', 'справа по коридору'), ('Кабинет директора', 'главный вход, слева');

INSERT INTO category (name, description) VALUES ('Компьютерное оборудование', 'принесли со склада'), ('Бытовая техника', 'маломощная');

INSERT INTO products (name, category_id, location_id, description, photo) VALUES
('Ноутбук', (SELECT id FROM category WHERE name = 'Компьютерное оборудование'), (SELECT id FROM location WHERE name = 'Офис #1'), 'Современный ноутбук с высокой производительностью', 'notebook.jpg'),
('Принтер', (SELECT id FROM category WHERE name = 'Компьютерное оборудование'), (SELECT id FROM location WHERE name = 'Офис #1'), 'Многофункциональный принтер', 'printer.jpg'),
('Холодильник', (SELECT id FROM category WHERE name = 'Бытовая техника'), (SELECT id FROM location WHERE name = 'Кабинет директора'), 'Энергоэффективный холодильник', 'fridge.jpg'),
('Микроволновка', (SELECT id FROM category WHERE name = 'Бытовая техника'), (SELECT id FROM location WHERE name = 'Офис #1'), 'Микроволновка с грилем', 'microwave.jpg');


