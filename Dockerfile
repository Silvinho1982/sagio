FROM php:8.2-apache

# Instala extensões necessárias
RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql

# Copia tudo da raiz do seu projeto para a pasta pública do Apache
COPY . /var/www/html/

# Garante que o Apache tenha permissão de leitura
RUN chown -R www-data:www-data /var/www/html

# Ajusta a porta dinâmica do Render
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf