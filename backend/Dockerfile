FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    zip \
    && docker-php-ext-install intl zip pdo pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8080

CMD php -S 0.0.0.0:$PORT -t public

CMD echo "PORT is $PORT" && php -S 0.0.0.0:$PORT -t public
