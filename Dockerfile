FROM php:8.2-apache

# Copia tudo para a pasta padrão do servidor Apache
COPY . /var/www/html/

# Ajusta as permissões de acesso
RUN chown -R www-data:www-data /var/www/html

# Configura a porta dinâmica do Render
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf