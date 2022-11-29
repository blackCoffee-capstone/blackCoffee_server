$(document).ready(function () {
	$('#login').on('click', function () {
		var param = {};
		param.email = $('#email').val();
		param.password = $('#password').val();

		if (param.email == '') {
			alert('아이디를 입력해주세요.');
			return false;
		} else if (param.password == '') {
			alert('비밀번호를 입력해주세요.');
			return false;
		}

		$.ajax({
			url: '/auth/admin-login',
			data: param,
			type: 'POST',
			dataType: 'JSON',

			success: function (data) {
				localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('refreshToken', data.refreshToken);
				console.log(localStorage.getItem('accessToken')); //토큰 저장 확인 (삭제 예정)
				console.log(localStorage.getItem('refreshToken')); //토큰 저장 확인 (삭제 예정)
				alert('로그인 성공!');
				window.location.href = '/admin';
			},
			error: function (data) {
				alert('이메일 혹은 비밀번호를 다시 한 번 확인해주세요.');
				return false;
			},
			headers: { Authorization: localStorage.getItem('accessToken') },
		});
	});
});
