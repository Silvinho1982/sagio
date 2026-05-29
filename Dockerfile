FROM php:8.2-apache

# Instala extensões
RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql

# Copia seus arquivos
COPY . /var/www/html/

# Muda a raiz do Apache para a pasta onde está o seu index.php (Ajuste "pages" para o nome da sua pasta)
ENV APACHE_DOCUMENT_ROOT /var/www/html/pages
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Ajusta a porta dinâmica do Render
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
