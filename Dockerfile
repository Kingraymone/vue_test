from nginx:1.21
copy ./dist /opt/public
expose 8080
cmd ["nginx","-g","daemon off"]
