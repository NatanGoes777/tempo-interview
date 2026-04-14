create table books (
  id bigint primary key generated always as identity,
  title text not null,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table reviews (
  id bigint primary key generated always as identity,
  book_id bigint references books(id) on delete cascade,
  comment text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);