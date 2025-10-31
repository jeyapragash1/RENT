Migration notes — Users consolidation and vehicles status

What I changed
- Added columns to `users` table: `role`, `phone`, `address`, `level`.
- Added a data migration that copies existing rows from `customers` and `admins` into `users`.
- Updated `vehicles.user_id` foreign key to reference `users`.
- Added `AdminSeeder` to create a development admin.
- Added migration to ensure `vehicles.status` allows the 'Rented' value.

How to apply (dev)
1. Backup your database (always).
2. From the `backend` folder run:

```powershell
composer install
php artisan migrate
php artisan db:seed
```

Notes / rollback
- The customers and admins tables are NOT automatically dropped; we keep them as a backup until you verify data.
- To rollback: `php artisan migrate:rollback` will reverse the last batch. Review migrations carefully before rolling back in production.
- The enum change migration uses raw SQL for MySQL. If your DB is not MySQL, the migration falls back to changing the column to `string`.

Follow-ups
- After testing, you may drop old `customers`/`admins` tables in a controlled migration.
- Consider adding tests around auth flows and admin role enforcement.
