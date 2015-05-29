# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 4000, host: 4000, auto_correct: true
  config.vm.synced_folder "site", "/site"

  config.vm.provision "shell", path: "jekyll-install.sh"
end
