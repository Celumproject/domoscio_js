# DomoscioJS

This README would document whatever steps are necessary to get the DomoscioJS SDK up and running.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

DomoscioJS requires the jQuery Javascript library. Make sure to load jquery.js file before loading DomoscioJS.

```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```

### Installing

Place the following <script>s near the end of your pages, right before the closing </body> tag, to enable them. jQuery must come first, then DomoscioJS, and then your script.

```
<script src="https://rawgit.com/Celumproject/domoscio_js/master/v1/domosciojs.js"></script>
```

Then you have to configure the DomoscioJS object like bellow with your credentials to access your enabled APIs. Refer to the API documentation for details:
https://domoscio.com/wiki/doku.php?id=api2:start

```
DomoscioJS.configuration = { 
    preproduction: true,
    version: API_VERSION,
    client_id: YOUR_INSTANCE_ID,
    client_passphrase: "YOUR_ACCESS_TOKEN"
}
```

| Key  | Type | Description |
| ------------- | ------------- | ------------- |
| preproduction  | `boolean` | true is for development (use the preproduction Domoscio API) and false for production |
| version  | `integer` | the current version of Domoscio API with latest features is 2 |
| client_id  | `integer` | this is your instance_id, required for access to your data |
| client_passphrase  | `string` | client_passphrase is your secret key, this token is paired with your client_id |

## Samples

Simple yet flexible JavaScript request for Domoscio API.

### Fetch

Fetch all object corresponding with the parameters :

```
DomoscioJS.Student.fetch({uid: "Example"})
```

### Find

Find the object corresponding with the id :

```
DomoscioJS.Student.find({id: "Example"})
```

### Create

Create an object :

```
DomoscioJS.Student.create({uid: "Example", active: true})
```

### Utils

Some utils routes :

```
DomoscioJS.GameplayUtil.util("get_review_progress", { student_id: id, knowledge_node_id: id })
```

## Deployment

To deploy this on a live system, use the <script> tag bellow : 

```
<script>https://cdn.rawgit.com/Celumproject/domoscio_js/d2e3ec24/v1/domosciojs.js</script>
```

## Versioning

Currently v1.0.1

## Authors

See the list of contributors (https://github.com/Celumproject/domoscio_js/contributors)