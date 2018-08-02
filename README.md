# ZeroTier Central Command Line Tool
(my.zerotier.com)
## Install
- `npm install -g zt-central`
## Usage
### general

- [ ] central -h
- [ ] central auth

linux: ~/.config/zt-central/config.js 
windows: %APPDATA%/zt-central/config/config.js

### flags
- [ ] --json 
- [ ] --host 
- [ ] --token 

### networks
- [ ] central network list
- [ ] central network get _network-id_

- [ ] central network add/create

- [ ] central network set name _network-id_ 'mantasy island'
- [ ] central network set description _network-id_ ''

- [ ] central network set 6plane _network-id_ 0/1/true/false
- [ ] central network set broadcast _network-id_
- [ ] central network set private _network-id_
- [ ] central network set public _network-id_
- [ ] central network set rfc4193 _network-id_
- [ ] central network set v4Auto _network-id_
- [ ] central network set multicast-limit _network-id_

- [ ] central network route add _network-id_ target [via addr]
- [ ] central network route delete _network-id_ target [via via addr]

- [ ] central network pool add _network-id_ start end
- [ ] central network pool delete _network-id_ start end

- [ ] central network set rules _network-id_ TODO (would be nice if it took stdin / a file)

### members
- [ ] central member list _network-id_
- [ ] central member get _network-id_ _member-id_

- [ ] central member name _name_ _network-id_ _member-id_

- [ ] central member set authorize _network-id_ _member-id_ 0/1
- [ ] central member set bridge _network-id_ _member-id_ 0/1
- [ ] central member set no-auto-assign _network-id_ _member-id_ 0/1

- [ ] central member set capability _network-id_ _member-id_ _cap-id_ 0/1
- [ ] central member set tag _network-id_ _member-id_ _tag-id_ _enum_ 0/1

### user
- [ ] central user get _user-id_
- [ ] central user get -e _email-address_

### more options
- [ ] central hostname save 'my.self-hosted-central.com'

## "The columnes don't line up!"
- central network list | column -t -s $'\t'
