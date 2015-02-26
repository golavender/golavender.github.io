project = node.default['project']
repo_directory = "/var/www/#{project}/"

include_recipe "apt"

# LAMP
include_recipe "apache2"
include_recipe "apache2::mod_rewrite"

include_recipe "php"
include_recipe "apache2::mod_php5"

# GRUNT
include_recipe "nodejs"

execute "npm install -g grunt-cli" do
  not_if "which grunt"
end

execute "npm install --unsafe-perm" do
  cwd repo_directory
end

execute "grunt" do
  cwd repo_directory
end

# SITE ACCESS
template "/etc/apache2/sites-available/#{project}.conf" do
  source "vhost.erb"
  mode 0644
  variables(
    :repo_directory => repo_directory
  )
  notifies :restart, resources(:service => "apache2")
end

execute "a2ensite #{project}" do
  notifies :restart, resources(:service => "apache2")
  not_if do File.symlink?("/etc/apache2/sites-enabled/#{project}") end
end
