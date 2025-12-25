FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libzip-dev \
    zip unzip \
    git \
    curl \
    && docker-php-ext-install intl zip pdo pdo_pgsql

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose Railway port
EXPOSE 8080

# Start Laravel on Railway port
CMD php -S 0.0.0.0:$PORT -t public
