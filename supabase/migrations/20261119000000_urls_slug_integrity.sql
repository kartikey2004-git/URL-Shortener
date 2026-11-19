-- Slug / short-code integrity for public.urls.
--
-- Idempotent and safe to re-run. Assumes the table already exists with the
-- columns the app uses (short_url, custom_url, ...); the original schema was
-- created in the Supabase dashboard and is not part of this repository.
--
-- PRE-FLIGHT (run manually first). Each query must return zero rows, otherwise
-- the matching statement below fails and the whole migration rolls back:
--
--   select short_url, count(*) from public.urls group by 1 having count(*) > 1;
--   select custom_url, count(*) from public.urls
--     where custom_url is not null group by 1 having count(*) > 1;
--
-- Existing rows are never rewritten, so every existing short URL keeps resolving.

begin;

-- 1. Short codes are unique. This is what makes concurrent inserts safe: the
--    application retries with a new code only when this constraint fires.
--    (Skipped if a unique constraint/index on the column already exists.)
do $$
begin
  if not exists (
    select 1
    from pg_index i
    join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any (i.indkey)
    where i.indrelid = 'public.urls'::regclass
      and i.indisunique
      and i.indnatts = 1
      and a.attname = 'short_url'
  ) then
    alter table public.urls
      add constraint urls_short_url_key unique (short_url);
  end if;

  -- Same for custom slugs (NULLs stay allowed and are not considered equal).
  if not exists (
    select 1
    from pg_index i
    join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any (i.indkey)
    where i.indrelid = 'public.urls'::regclass
      and i.indisunique
      and i.indnatts = 1
      and a.attname = 'custom_url'
  ) then
    alter table public.urls
      add constraint urls_custom_url_key unique (custom_url);
  end if;
end
$$;

-- 2. Policy for NEW custom slugs, mirrored from src/features/links/slug.js:
--    3-32 chars of [a-z0-9_-], starting and ending alphanumeric, not reserved.
--    NOT VALID: enforced for inserts/updates from now on, but legacy rows that
--    predate the policy are not checked (and therefore keep resolving).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.urls'::regclass and conname = 'urls_custom_url_format'
  ) then
    alter table public.urls
      add constraint urls_custom_url_format check (
        custom_url is null
        or (
          custom_url ~ '^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$'
          and custom_url <> all (array[
            'about','admin','api','app','assets','auth','create','dashboard',
            'help','link','links','login','logout','new','null','privacy',
            'register','robots','settings','signin','signup','sitemap','static',
            'support','terms','undefined','www'
          ])
        )
      ) not valid;
  end if;
end
$$;

commit;

-- OPTIONAL, later: once legacy rows are cleaned up (or confirmed compliant),
--   alter table public.urls validate constraint urls_custom_url_format;
