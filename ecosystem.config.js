module.exports = {
  apps: [{
    name: 'disney-app',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    cwd: '/var/www/disney-app',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/disney-app/error.log',
    out_file: '/var/log/disney-app/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
