FROM php:8.3-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl libpq-dev unzip libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

EXPOSE 8000