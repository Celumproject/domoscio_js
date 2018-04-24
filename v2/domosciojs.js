/* DomoscioJS v2.0.0 (Custom Build)
 * Dependencies : jQuery (https://jquery.com/)
 * Minify with https://skalman.github.io/UglifyJS-online/
 * Build: https://domoscio.com/ | https://github.com/Celumproject/domoscio_js
 */

//#######################################################//
//######              UTILS FUNCTIONS              ######//
//#######################################################//

if ("undefined" == typeof jQuery)
    throw new Error("DomoscioJS requires jQuery");

// Errors
function errors(type = 'token') {
    var errors = "";
    switch (type) {
        case 'token':
            errors = 'Invalid API Token';
            break;
        default:
            errors = 'Invalid API Token';
            break;
    }
    return errors;
}

// Build http call
function http_calls(ressource = "") {
    var host_url = (DomoscioJS.configuration.preproduction == true ? (DomoscioJS.configuration.test == true ? "https://domoscio-adaptive-engine-staging.azurewebsites.net" : "https://domoscio-adaptive-engine.azurewebsites.net") : "http://localhost:3001");
    var version = DomoscioJS.configuration.version;
    var instance = DomoscioJS.configuration.client_id;
    var token = DomoscioJS.authorization_token(DomoscioJS.configuration.client_passphrase);

    if (token == false)
        return token
    else
        var url = host_url + '/v' + version + '/instances/' + instance + '/' + ressource;
    return url;
}

// Redirect to the right route
function ressource(name) {
    // If name isn't a string 
    if (typeof name !== "string") {
        name = name.toString();
        var pos = name.indexOf(" ");
        name = name.substring(pos + 1);
        pos = name.indexOf("(");
        name = name.substring(0, pos);
    }
    // ----------------------
    array = name.split(/(?=[A-Z])/);
    var add_underscore = "";
    for (i = 0; i < array.length; i++) {
        (i < array.length - 1) ? add_underscore += array[i] + "_" : add_underscore += array[i];
    }
    var ressource = "";
    ressource += add_underscore.toLowerCase() + "s";
    return ressource;
}

//#######################################################//
//######               HTTP REQUEST                ######//
//#######################################################//

// Méthode Fetch
function fetch(filters = {}) {
    var object = ressource(this.child.parent.name);
    var token = DomoscioJS.authorization_token(DomoscioJS.configuration.client_passphrase);
    var url = http_calls(object);
    if (url !== false) {
        var data = "";
        Object.keys(filters).map(function (key, index) {
            if (index == 0)
                data += key + "=" + filters[key];
            else
                data += "&" + key + "=" + filters[key];
        });
        var result = "";
        $.ajax({
            headers: DomoscioJS.AuthorizationToken.request_headers(),
            method: "GET",
            url: url,
            data: data,
            async: false,
            dataType: "json",
            crossDomain: true,
            tryCount: 0,
            retryLimit: 1,
            complete: function (e, statut) {
                store_credentials(e);
                if(e.status == (401 || 403)) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        //try again
                        $.ajax(this);
                        return;
                    }
                    return;
                }
                result = JSON.parse(e.responseText);
                var pages = Math.ceil((parseInt(e.getResponseHeader('total')) / parseInt(e.getResponseHeader('per-page'))));
                if (pages >= 2) {
                    for (var i = 2; i <= pages; i++) {
                        $.ajax({
                            headers: {
                                'Authorization': 'Token token=' + token
                            },
                            method: "GET",
                            url: url,
                            data: data + "&page=" + i,
                            async: false,
                            dataType: "json",
                            crossDomain: true,
                            complete: function (e, statut) {
                                result = result.concat(JSON.parse(e.responseText));
                            }
                        });
                    }
                }
            },
            error: function (e, statut) {
                console.error("We're sorry, but something went wrong. (500)");
            }
        });
        return result;
    }
};

// Méthode Find
function find(filters = {}) {
    var object = ressource(this.child.parent.name);
    var token = DomoscioJS.authorization_token(DomoscioJS.configuration.client_passphrase);
    var id = "";
    if ("id" in filters) {
        id = filters['id'];
        var url = http_calls(object) + "/" + id;
        if (url !== false) {
            var result = "";
            $.ajax({
                headers: {
                    'Authorization': 'Token token=' + token
                },
                method: "GET",
                url: url,
                async: false,
                dataType: "json",
                crossDomain: true,
                complete: function (e, statut) {
                    result = JSON.parse(e.responseText);
                },
                error: function (e, statut) {
                    console.error("We're sorry, but something went wrong. (500)");
                }
            });
            return result;
        }
    }
    else
        console.error("We're sorry, but something went wrong. (500)");
};

// Méthode Create
function create(data = {}) {
    var object = ressource(this.child.parent.name);
    var token = DomoscioJS.authorization_token(DomoscioJS.configuration.client_passphrase);
    var url = http_calls(object);
    if (url !== false) {
        var result = "";
        $.ajax({
            headers: {
                'Authorization': 'Token token=' + token
            },
            method: "POST",
            url: url,
            data: data,
            async: false,
            dataType: "json",
            crossDomain: true,
            complete: function (e, statut) {
                console.log(JSON.stringify(data));
                result = JSON.parse(e.responseText);
            },
            error: function (e, statut) {
                console.error("We're sorry, but something went wrong. (500)");
            }
        });
        return result;
    }
};

// Méthode Util
function util(route, filters = {}) {
    var object = ressource(this.child.parent.name);
    var token = DomoscioJS.authorization_token(DomoscioJS.configuration.client_passphrase);
    var url = http_calls(object) + "/" + route;
    if (url !== false) {
        var data = "";
        Object.keys(filters).map(function (key, index) {
            if (index == 0)
                data += key + "=" + filters[key];
            else
                data += "&" + key + "=" + filters[key];
        });
        var result = "";
        $.ajax({
            headers: {
                'Authorization': 'Token token=' + token
            },
            method: "GET",
            url: url,
            data: data,
            async: false,
            dataType: "json",
            crossDomain: true,
            complete: function (e, statut) {
                result = JSON.parse(e.responseText);
            },
            error: function (e, statut) {
                console.error("We're sorry, but something went wrong. (500)");
            }
        });
        return result;
    }
};

//#######################################################//
//######                    LIB                    ######//
//#######################################################//

let Student = {
    name: "Student",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let Objective = {
    name: "Objective",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let ObjectiveStudent = {
    name: "ObjectiveStudent",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let ObjectiveStudentAssessment = {
    name: "ObjectiveStudentAssessment",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let KnowledgeNode = {
    name: "KnowledgeNode",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let KnowledgeNodeStudent = {
    name: "KnowledgeNodeStudent",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let KnowledgeNodeContent = {
    name: "KnowledgeNodeContent",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let Event = {
    name: "Event",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let Session = {
    name: "Session",
    child: {},
    fetch,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let Content = {
    name: "Content",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let Tag = {
    name: "Tag",
    child: {},
    fetch, find, create,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let GameplayUtil = {
    name: "GameplayUtil",
    child: {},
    util,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let ReviewUtil = {
    name: "ReviewUtil",
    child: {},
    util,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();
let RecommendationUtil = {
    name: "RecommendationUtil",
    child: {},
    util,
    init: function () {
        this.child.parent = this;
        delete this.init;
        return this;
    }
}.init();

//#######################################################//
//######                DomoscioJS                 ######//
//#######################################################//

DomoscioJS = {

    // Configuration
    "configuration": {
        preproduction: true,
        test: false,
        version: 2,
        client_id: 0,
        client_passphrase: ""
    },

    // Token
    "authorization_token": function (token) {
        if (token == null) {
            console.error(JSON.stringify(errors()));
            return false;
        }
        else
            return token;
    },

    "AuthorizationToken": {
        token: "",
    },

    Student,
    Objective,
    ObjectiveStudent,
    ObjectiveStudentAssessment,
    KnowledgeNode,
    KnowledgeNodeStudent,
    KnowledgeNodeContent,
    Event,
    Session,
    Content,
    Tag,
    GameplayUtil,
    ReviewUtil,
    RecommendationUtil

}

//#######################################################//
//######               OAUTH METHODS               ######//
//#######################################################//

DomoscioJS.AuthorizationToken.get_token = function () {
    var token = localStorage.getItem("auth_headers");
    if (token == null)
        token = DomoscioJS.configuration.client_passphrase;
    else
        token = JSON.parse(token);
    return token;
}

DomoscioJS.AuthorizationToken.request_headers = function(){
    var auth_token = DomoscioJS.AuthorizationToken.get_token();

    var headers = {};
    if(typeof auth_token == "string"){
        headers = {
            // 'user_agent': 'DomoscioJS V2 JavaScriptBindings',
            'Authorization': "Token token=" + auth_token,
            'Content-Type': 'application/json'
        };
    }
    else{
        headers = {
            // 'user_agent': 'DomoscioJS V2 JavaScriptBindings',
            'AccessToken': auth_token.AccessToken,
            'RefreshToken': auth_token.RefreshToken,
            'Content-Type': 'application/json'
        };
    }
    return headers;
}

function store_credentials(response){
    if (response.getResponseHeader("accesstoken") != null && response.getResponseHeader("refreshtoken") != null) {
        var auth_token = {
            'AccessToken': response.getResponseHeader("accesstoken"),
            'RefreshToken': response.getResponseHeader("refreshtoken")
        };
        localStorage.setItem("auth_headers", JSON.stringify(auth_token));
    }
}
