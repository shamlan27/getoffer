FROM php:8.2-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install intl zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files first
COPY composer.json composer.lock ./

# Install PHP dependencies (THIS CREATES vendor/)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy rest of app
COPY . .

# Permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=8080

