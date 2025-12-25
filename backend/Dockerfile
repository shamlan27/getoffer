FROM php:8.2-cli

# Install system libraries
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

# Copy composer files first
COPY composer.json composer.lock ./

# Install dependencies (ignore local platform mismatch)
RUN composer install \
    --no-dev \
    --optimize-autoloader \

