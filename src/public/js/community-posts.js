$(document).ready(function () {
	var accessToken = localStorage.getItem('accessToken');
	var postNum = sessionStorage.getItem('postNumber');

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
			alert(response.responseText);
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
