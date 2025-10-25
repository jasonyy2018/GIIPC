# Use Nginx Alpine as base image
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy static files to Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY about.html /usr/share/nginx/html/
COPY contact.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY profile.html /usr/share/nginx/html/
COPY privacy.html /usr/share/nginx/html/
COPY terms.html /usr/share/nginx/html/
COPY sitemap.html /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY css/ /usr/share/nginx/html/css/
COPY data/ /usr/share/nginx/html/data/
COPY images/ /usr/share/nginx/html/images/
COPY test-api.html /usr/share/nginx/html/
COPY test-paths.html /usr/share/nginx/html/
COPY health /usr/share/nginx/html/

# Nginx user already exists in the base image, no need to create

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
