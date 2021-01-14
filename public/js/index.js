/* ************* 글로벌설정 ***************/
var auth = firebase.auth();
var db = firebase.database();
var user = null;
var google = new firebase.auth.GoogleAuthProvider();
var facebook = new firebase.auth.FacebookAuthProvider();

/* ************* 이벤트콜백 ***************/
	function onAdd(r) {		
		if (!r.val().checked) addHTML(r);
		document.querySelector(".type-wrap").reset();
	}
	function onRev(r) {
		console.log(r.val());
	}
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

	function onCheck(key,chk,el){
		db.ref('root/todo/'+user.uid+'/'+key).update({checked:chk})	
		$(el).toggleClass("fa-check");			
		$(el).parent().fadeOut(200);		
	}
	function onCompleted(){
		var ref = db.ref('root/todo/'+user.uid);
		ref.orderByChild('checked').equalTo(true).once('value').then(getData)
		$(".type-wrap").hide();
	}
	function onToDo(){
		var ref = db.ref('root/todo/'+user.uid);
		ref.orderByChild('checked').equalTo(false).once('value').then(getData)
		$(".type-wrap").show();
	}
	/************** 사용자함수 ***************/	
	function getData(r){
		$(".list-wrap").empty();
		r.forEach(v => {
			console.log(v.val());
			addHTML(v);
		});
	}
	function addHTML(r){
		var html ='<li class="list swiper-slide" id="'+r.key+'">';
		if(r.val().checked){
				html +='<i class="fa fa-check" aria-hidden="true" onclick="onCheck(\''+r.key+'\',false,this);"></i><span>'+r.val().comment+'</span>';
		}else{
				html +='<i class="fa" aria-hidden="true" onclick="onCheck(\''+r.key+'\',true,this);"></i><span>'+r.val().comment+'</span>';}
				html +='</li>';
				$(".list-wrap").prepend(html);
	}

	function onSubmit(el){		
		var comment = el.comment.value;		
		var data = {
			createAt : moment().format('lll'),
			checked : false,
			comment : el.comment.value
		}
		!comment=="" ? db.ref('root/todo/'+ user.uid).push(data):""
		return false;
	}
	function dbInit() {
		db.ref('root/todo/'+ user.uid).on('child_added', onAdd);
		db.ref('root/todo/'+ user.uid).on('child_removed', onRev);
		db.ref('root/todo/'+ user.uid).on('child_changed', onChg);
	}
		/************** 이벤트등록 ***************/
	auth.languageCode = 'ko';
	auth.onAuthStateChanged(onAuthChg);
	$('#btGoogleLogin').click(onGoogleLogin);
	$('#btLogout').click(onLogout);
	