FROM php:8.4-apache

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    bcmath \
    zip \
    intl \
    xml \
    curl \
    opcache \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf

# Copy Composer files first for better Docker cache usage
COPY composer.json composer.lock* ./

# Install dependencies without Laravel scripts
RUN composer install \
    --no-interaction \
    --prefer-dist \
    --no-scripts

# Now copy the Laravel application
COPY . .

# Run Laravel Composer scripts after artisan exists
RUN php artisan package:discover --ansi

RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache \
    && chmod -R 775 \
    storage \
    bootstrap/cache

EXPOSE 80

CMD ["apache2-foreground"]
