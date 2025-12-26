#!/bin/sh
set -e

# Create storage link if it doesn't exist
if [ ! -L /var/www/html/public/storage ]; then
    echo 'Creating storage symlink...'
    php artisan storage:link
fi

# Execute the main container command
exec "$@"