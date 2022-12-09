$(document).ready(function () {
	var accessToken = localStorage.getItem('accessToken');
	var refreshToken = localStorage.getItem('refreshToken');
	var postNum = sessionStorage.getItem('postNumber');

	if ((accessToken != null) & (refreshToken != null)) {
		jwtPayload = JSON.parse(window.atob(accessToken.split('.')[1]));

		var param = {
			refreshToken: refreshToken,
		};
		if (jwtPayload.exp * 1000 < new Date().getTime()) {
			console.log('Time Expired');
			$.ajax({
				url: '/auth/token-refresh',
				type: 'POST',
				data: param,
				headers: { Authorization: 'Bearer ' + accessToken },
				dataType: 'JSON',
				success: function (data) {
					localStorage.setItem('accessToken', data.accessToken);
					window.location.reload();
				},
				error: function (data) {
					console.log(data);
				},
			});
		}
	} else {
		$.ajax({
			url: '/users',
			type: 'Get',
			headers: { Authorization: 'Bearer ' + accessToken },
			success: function (data) {
				if (data.type != 'Admin') {
					alert('관리자 권한이 필요합니다.');
					window.location.href = '/admin/login';
				}
			},
			error: function () {
				alert('관리자 권한이 필요합니다.');
				window.location.href = '/admin/login';
			},
		});
	}

	$.ajax({
		url: '/posts/' + postNum,
		type: 'GET',
		dataType: 'json',
		dataSrc: '',
		headers: { Authorization: 'Bearer ' + accessToken },
		success: function (post) {
			photos = post.photoUrls;

			$('.posts-header').append('<div class="title">' + post.title + '</div>');
			$('.posts-header').append('<div class="id">' + post.user.nickname + '</div>');
			$('.posts-body').append('<div class="content">' + post.content + '</div>');
			for (i = 0; i < photos.length; i++) {
				$('.posts-body').append(
					'<a class="image image' +
						i +
						'"><img src="' +
						post.photoUrls[i] +
						'" alt="image[i]" style="width:200px; height:auto;"</a>',
				);
			}
		},
		error: function (response) {
			console.log(response.responseText);
		},
	});

	$('.btn-delete').click(function () {
		var result = confirm('해당 게시글을 정말로 삭제하시겠습니까?');
		if (result) {
			$.ajax({
				url: '/posts/' + postNum,
				type: 'DELETE',
				processData: false,
				data: '',
				headers: { Authorization: 'Bearer ' + accessToken },
				success: function (data) {
					alert('삭제 완료!');
					window.close();
				},
				error: function (data) {
					console.log(data);
				},
			});
		}
	});
});
