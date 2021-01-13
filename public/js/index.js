/************** 글로벌설정 ***************/
var auth = firebase.auth();
var db = firebase.database();
var user = null;
var ref = null;
var google = new firebase.auth.GoogleAuthProvider();
var facebook = new firebase.auth.FacebookAuthProvider();

/************** 이벤트콜백 ***************/
function onGetHTML(r) {
	$(".list-wrap").empty();
}
	var timeout;
	function onCheck(el) {
		$(el).removeClass("active").siblings("i").addClass("active");
		if ($(el).hasClass("fa-circle")) {
			timeout = setTimeout(() => {
				$(el).parent().remove();
				var data = {
					checked: true
				}
				db.ref('root/todo/' + user.uid + '/' + $(el).parent().attr("id")).update(data)
			}, 1000);
		} else {
			clearTimeout(timeout)
		}

	}

	function onAdd(r) {
		if (!r.val().checked) {
			console.log(r.val());
			var html = '<li id="' + r.key + '">';
			html += '<i class="active far fa-circle" onclick="onCheck(this,false)"></i>';
			html += '<i class="far fa-check-circle" onclick="onCheck(this,true)"></i>';
			html += '<span>' + r.val().comment + '</span>';
			html += '</li>';
			$(".list-wrap").prepend(html);
		}
		document.querySelector(".add-wrap").reset();
	}
	/* function onRev(r) {
		console.log(r.val());
	}*/
	function onChg(r) {
		console.log(r.val());
	}

	function onAuthChg(r) {
		if (r) {
			user = r;
			$('.sign-wrap .icon img').attr('src', user.photoURL);
			$('.sign-wrap .email').html(user.email);
			$('.modal-wrapper.auth-wrapper').hide();
			$('#btLogout').show();
			dbInit();
		} else {
			user = null;
			$('.sign-wrap .icon img').attr('src', 'https://via.placeholder.com/36');
			$('.sign-wrap .email').html('');
			$('.modal-wrapper.auth-wrapper').show();
			$('#btLogout').hide();
		}
	}

	function onGoogleLogin() {
		auth.signInWithPopup(google);
	}

	function onLogout() {
		auth.signOut();
	}

	/************** 사용자함수 ***************/
	function showDone() {
		db.ref('root/todo/' + user.uid).once('value').then(onGetHTML)
	}

	function dbInit() {
		db.ref('root/todo/' + user.uid).on('child_added', onAdd);
		/* db.ref('root/todo/'+user.uid).on('child_removed', onRev); */
		db.ref('root/todo/' + user.uid).on('child_changed', onChg);
	}

	function onSubmit(r) {
		var data = {
			checked: false,
			comment: r.task.value,
			createAt: moment().format('LLL')
		}
		if (!r.task.value == "") {
			db.ref('root/todo/' + user.uid).push(data);
		}

		return false;
	}

	/************** 이벤트등록 ***************/
	auth.languageCode = 'ko';
	auth.onAuthStateChanged(onAuthChg);
	$('#btGoogleLogin').click(onGoogleLogin);
	$('#btLogout').click(onLogout);