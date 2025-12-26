FROM php:8.2-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        intl \
        zip \
        pdo \
        pdo_pgsql \
        pgsql \
        gd \
        bcmath \
        exif \
        opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files
COPY composer.json composer.lock ./

# Install deps WITHOUT scripts (IMPORTANT FIX)
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts

# Copy full Laravel app (artisan exists now)
COPY . .

RUN php artisan storage:link

# Permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8080



CMD php artisan serve --host=0.0.0.0 --port=8080
