FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libicu-dev \
    libzip-dev \
    zip unzip \
    && docker-php-ext-install intl zip

WORKDIR /var/www
COPY . .

CMD ["php-fpm"]
