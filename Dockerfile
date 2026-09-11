# Dockerfile — Mission Quest (static site)
#
# Serves the contents of app/ via nginx:alpine.
# The image is tiny (~40 MB) and runs as a non-root user (nginx-unprivileged
# would be even safer; we accept the default for simplicity).

FROM nginx:alpine

# Wipe the default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy the static site from app/
COPY app/ /usr/share/nginx/html/

# Optional: a tiny nginx config that disables gzip on small assets (nginx
# default is fine; left as default).
# EXPOSE 80 is implied by nginx:alpine's default CMD.

# Health check via wget (busybox ships it). Default for Coolify.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
