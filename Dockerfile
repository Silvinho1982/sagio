FROM php:8.2-apache

# Instala a extensão do PostgreSQL para o PHP conseguir falar com o banco Neon
RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql

# Copia os arquivos do seu site para a pasta pública do Apache
COPY . /var/www/html/

# Ajusta a porta do Apache para a porta dinâmica que a nuvem do Render exige
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
