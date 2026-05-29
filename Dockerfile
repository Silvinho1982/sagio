FROM php:8.2-apache

# Copia tudo para a pasta padrão do servidor Apache
COPY . /var/www/html/

# Instala e ativa o driver do PostgreSQL para o PHP
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && docker-php-ext-enable pdo_pgsql

# Configura a porta dinâmica do Render
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Instala o driver do PostgreSQL para o PHP
RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql