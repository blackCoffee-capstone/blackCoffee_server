$(document).ready(function () {
	var accessToken = localStorage.getItem('accessToken');

	$.ajax({
		url: '/users/admin-test',
		type: 'Get',
		headers: { Authorization: 'Bearer ' + accessToken },
		success: function (data) {
			console.log(data);
		},
		error: function (data) {
			alert('관리자 권한이 필요한 페이지입니다.');
			window.location.href = '/admin/login';
		},
	});

	$('.main_menu').click(function () {
		$('.sub_menu').slideUp();
		if ($(this).children('.sub_menu').is(':hidden')) {
			$(this).children('.sub_menu').slideDown();
		} else {
			$(this).children('.sub_menu').slideUp();
		}
	});
	$('.logout').click(function () {
		$.ajax({
			url: '/auth/logout',
			type: 'POST',
			headers: { Authorization: 'Bearer ' + accessToken },
			success: function (data) {
				localStorage.clear();
				alert('로그아웃 성공!');
				location.reload();
			},
			error: function (data) {
				console.log(data);
			},
		});
	});
});
