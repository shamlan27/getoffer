# ---------- PHP ----------
FROM php:8.2-fpm

# System deps
RUN apt-get update && apt-get install -y \
    git unzip zip curl libicu-dev libzip-dev \
    nodejs npm \
    && docker-php-ext-install intl zip pdo pdo_pgsql

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy app
COPY . .

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader

# Publish Filament assets (THIS FIXES UI)
RUN php artisan filament:assets

# Install Node deps & build assets (THIS FIXES FILAMENT)
RUN npm install && npm run build



# Permissions
RUN chown -R www-data:www-data /var/www

EXPOSE 8080

CMD php artisan storage:link || true && \
    php artisan migrate --force || true && \
    php artisan serve --host=0.0.0.0 --port=8080
