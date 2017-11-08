var user;

// funciones

function cargador(carga) {
    if (carga == "series"){
        $("#el_contenedor").load(carga + '.html',  function(response, status) {
              if ( status != "error" ) {
                  loadSeries();
              }
          });
        deleteBackground(carga);
    } else if (carga == "movies"){
        $("#el_contenedor").load(carga + '.html',  function(response, status) {
              if ( status != "error" ) {
                  loadMovies();
              }
          });
        deleteBackground(carga);
    } else if (carga == "profile") {
        $("#el_contenedor").load(carga + '.html',  function(response, status) {
              if ( status != "error" ) {
                  showProfile(user);
              }
          });
    } else if (carga == "help"){
        $("#el_contenedor").load(carga + '.html');
        deleteBackground(carga);
    } else if (carga != "search") {
        $("#el_contenedor").load(carga + '.html');
        deleteBackground(carga);
    } else {
        if (document.getElementById('searchbar').value != ""){
            $("#el_contenedor").load(carga + '.html');
            // let what = document.getElementById('searchbar').value;
        }
    }
}

function deleteBackground(carga) {
    let navbar_values = ["home", "series", "movies", "help"];
    for (let i = 0; i < navbar_values.length; i++) {
        if (navbar_values[i] == carga) { $("#" + carga).addClass("activate"); }
        else { $("#" + navbar_values[i]).removeClass("activate"); }
    }
    $('#login').removeClass("activate");
}

function hideOptions() {
    $('#login').css('display', 'none');
    $('#signup').css('display', 'none');
}

function showLogMenu() {
    $('.ulist').html('').append('<li><a><input type="image" src="img/google.png" onclick="logGoogle();" width="30" height="30"></input></a></li>' +
    "<li><a><button onclick='cargador()'>Register</button></a></li>" +
    '<li><a><button>Log In</button></a></li>' +
    '<li><a style="color:white">Password: <input type="password" style="width: 120px"></a></li>'+
    '<li><a style="color: white">Username: <input style="width: 120px"></a></li>')
}

function logMenu() {
    hideOptions();
    showLogMenu();
}

function register() {
    let usr_name = $('#txt_usr_name').val();
    let f_name = $('#txt_f_name').val();
    let l_name = $('#txt_l_name').val();
    let e_mail = $('#txt_e_mail').val();
    let phone = $('#txt_phone').val();
    let re_pass = $('#txt_re_pass').val();
    let re_cpass = $('#txt_re_cpass').val();

    let db_register = firebase.database();

    db_register.ref('/users/').push({
        'f_name':f_name,
        'l_name':l_name,
        'e_mail':e_mail,
        'phone':phone,
        'pass':re_pass
    });
    // db_register.ref('/users/' + usr_name + '/f_name').set(f_name);
    // db_register.ref('/users/' + usr_name + '/l_name').set(l_name);
    // db_register.ref('/users/' + usr_name + '/e_mail').set(e_mail);
    // db_register.ref('/users/' + usr_name + '/phone').set(phone);
    // db_register.ref('/users/' + usr_name + '/pass').set(re_pass);
}

function submit() {
    let usr = document.getElementById('usr').value;
    let pass = document.getElementById('pass').value;
    console.log(usr + " " + pass);
}

function logGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;

        let name = user.displayName;
        let photo = user.photoURL;
        let email = user.email;

        $('.ulist').html('').append("<li><a class='photo_href' href='#'><img id='photo'></img></a></li>" +
        "<li><a href='#'><button id='usr_name' class='btn btn-secondary dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button></a></li>" +
        "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'><a class='dropdown-item'>Action</a><a class='dropdown-item'>Action</a><a class='dropdown-item'>Action</a></div>" +
        "</a></li>");

        $('#usr_name').css('display', 'block');
        $('#usr_name').text(name);
        $('#photo').css('display', 'block');
        $('#photo').attr('src', photo);
        $('.photo_href').attr('onclick', "cargador('profile')");
        cargador("home");

    }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
        // ...
    });
}

function showProfile(user) {
    console.log(user);
    $('#profile_img').attr('src', user.photoURL);
    $('#profile_img').css('width', '100px');
    $('#profile_img').css('height', '100px');
    $('#profile_img').css('border-radius', '20px');
    $('#profile_name').text('Profile name: ' + user.displayName)
}

function loadSeries() {
    let series = $('#series_list');

    let dbSeries = firebase.database().ref('/series/');
    dbSeries.on('value', snapshot => {
        snapshot.forEach(snap => {
            let div = document.createElement('div');
            let input = document.createElement('input');
            div.classList = "col-lg-3 portfolio-item";
            input.type = "image";
            input.src = snap.val().photoURL;
            input.classList.add("list-cont");
            input.onclick = e => {loadInfoSerie(snap.key)};
            div.append(input);
            series.append(div);
        })
    })
}

function loadInfoSerie(serie) {
    $("#el_contenedor").load("serie.html", function( response, status ) {
        if ( status != "error" ) {
            const dbX = firebase.database().ref("/series/" + serie);
            dbX.on('value', snap => {
                let info = document.getElementById("info");
                let input = document.createElement("input");
                input.type = "image";
                input.src = snap.val().photoURL;
                input.classList.add("info");
                info.append(input);
                $("#name").text("Title: " + snap.val().name);
                $("#director").text("Director: " + snap.val().director);
            })
        }
    });
}

function loadMovies() {
    let movies = $('#movies_list');

    const dbMovies = firebase.database().ref('/movies/');
    dbMovies.on('value', snapshot => {
        snapshot.forEach(snap => {
            let div = document.createElement('div');
            let input = document.createElement('input');
            div.classList = "col-lg-3 col-md-4 col-sm-6 portfolio-item";
            input.type = "image";
            input.src = snap.val().photoURL;
            input.classList.add("list-cont");
            input.onclick = e => {loadInfoMovie(snap.key)};
            div.append(input);
            movies.append(div);
        })
    })
}

function loadInfoMovie(movie) {
    $("#el_contenedor").load("movie.html", function( response, status ) {
        if ( status != "error" ) {
            const dbX = firebase.database().ref("/movies/" + movie);
            dbX.on('value', snap => {
                let info = document.getElementById("info");
                let input = document.createElement("input");
                input.type = "image";
                input.src = snap.val().photoURL;
                input.classList.add("info");
                info.append(input);
                $("#name").text("Title: " + snap.val().name);
                $("#director").text("Director: " + snap.val().director);
            })
        }
    });
}

$( document ).ready(function() {
    let config = {
       apiKey: "AIzaSyCkN2-SkpibvX6T2bvB5ZtUWZLaQSqNqB0",
       authDomain: "neftnoteweb.firebaseapp.com",
       databaseURL: "https://neftnoteweb.firebaseio.com",
       projectId: "neftnoteweb",
       storageBucket: "neftnoteweb.appspot.com",
       messagingSenderId: "117793164770"
     };
    firebase.initializeApp(config);

    cargador("home");

    $('.carousel').carousel({
        interval: 100
    });
});
