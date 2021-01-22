# ZeroTier Central API client

(my.zerotier.com)

Bring your own fetch.
No dependencies, pure functions, etc

## Install
`npm install @laduke/zerotier-central-client`

## Usage
In node you need the api access token from my.zerotier.com.
In the browser it'll use cookies, so no token required.
This doesn't depend on any of the [many fetch/request modules](https://github.com/request/request/issues/3143) out there, but returns objects that should be easy to pass into any of them.


```javascript
const axios = require("axios").default;
const { Central } = require("@laduke/zerotier-central-client");

run();
async function run() {
    const opts = { token: "the-api-token" };

    central = Central(opts);

    const networks = await axios(central.networkList());
    console.log(networks.data);
}
```
# API 

## Objects

<dl>
<dt><a href="#Central">Central</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#NetworkId">NetworkId</a> : <code>String</code></dt>
<dd><p>16 digit ZeroTier Network ID</p>
</dd>
<dt><a href="#NodeId">NodeId</a> : <code>String</code></dt>
<dd><p>10 digit ZeroTier Node ID</p>
</dd>
<dt><a href="#UserId">UserId</a> : <code>String</code></dt>
<dd><p>Central User ID (uuid)</p>
</dd>
</dl>

<a name="Central"></a>

## Central : <code>object</code>
**Kind**: global namespace  

* [Central](#Central) : <code>object</code>
    * [.networkDelete(networkId)](#Central+networkDelete)
    * [.memberDelete(networkId, id)](#Central+memberDelete)

<a name="Central+networkDelete"></a>

### central.networkDelete(networkId)
Delete a Network by ID

**Kind**: instance method of [<code>Central</code>](#Central)  

| Param | Type | Description |
| --- | --- | --- |
| networkId | [<code>NetworkId</code>](#NetworkId) | 16 digit network ID |

<a name="Central+memberDelete"></a>

### central.memberDelete(networkId, id)
Delete a Member from a Network by Network and Node ID

**Kind**: instance method of [<code>Central</code>](#Central)  

| Param | Type |
| --- | --- |
| networkId | [<code>NetworkId</code>](#NetworkId) | 
| id | [<code>NodeId</code>](#NodeId) | 

<a name="Options"></a>

## Options : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | ZeroTier Central API Token |
| base | <code>string</code> | Default is https://my.zerotier.com/api |

<a name="NetworkId"></a>

## NetworkId : <code>String</code>
16 digit ZeroTier Network ID

**Kind**: global typedef  
<a name="NodeId"></a>

## NodeId : <code>String</code>
10 digit ZeroTier Node ID

**Kind**: global typedef  
<a name="UserId"></a>

## UserId : <code>String</code>
Central User ID (uuid)

**Kind**: global typedef  

## TODO
- [ ] jsdoc

