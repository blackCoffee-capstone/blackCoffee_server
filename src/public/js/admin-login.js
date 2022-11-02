$(document).ready(function () {
	$('#login').on('click', function () {
		var param = {};
		param.email = $('#email').val();
		param.password = $('#password').val();

		if (param.email == '') {
			alert('아이디를 입력해주세요.');
		} else if (param.password == '') {
			alert('비밀번호를 입력해주세요.');
		}

		// $.ajax({
		// 	url:
		// 	data: param,
		// 	type: 'POST',
		// 	dataType: 'JSON',
		// });

		//TODO : 통신처리
	});
});
