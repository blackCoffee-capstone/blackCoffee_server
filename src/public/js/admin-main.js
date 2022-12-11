$(document).ready(function () {
	var accessToken = localStorage.getItem('accessToken');
	var refreshToken = localStorage.getItem('refreshToken');

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
		url: '/admins/ad-forms',
		type: 'Get',
		dataType: 'json',
		dataSrc: '',
		headers: { Authorization: 'Bearer ' + accessToken },
		success: function (response) {
			table = $('.ad-request').DataTable({
				data: response,
				columns: [
					{
						data: null,
						render: function (data, type, row, meta) {
							return meta.row + meta.settings._iDisplayStart + 1;
						},
					},
					{ data: 'businessName' },
					{ data: 'email' },
					{
						data: null,
						title: 'DATE',
						render: function (data) {
							let date = '' + data.createdAt;
							return date.substring(0, 10);
						},
					},
					{ data: 'status' },
					{
						data: null,
						render: function (data) {
							return "<button class='btn request-detail' type='button'>자세히보기</button>";
						},
					},
				],
				ordering: false,
				pageLength: 4,
				lengthMenu: [
					[5, 10, 20, -1],
					[5, 10, 20, 'Todos'],
				],
				visible: false,
				searching: false,
				info: false,
				autoWidth: false,
			});
		},
		error: function (response) {
			console.log(response.responseText);
		},
	});

	$(document).on('click', '.request-detail', function () {
		location.href = '/admin/ad-request';
	});

	$.ajax({
		url: '/admins/adsAll',
		type: 'Get',
		dataType: 'json',
		dataSrc: '',
		headers: { Authorization: 'Bearer ' + accessToken },
		success: function (response) {
			table = $('.ad-register').DataTable({
				data: response,
				columns: [
					{
						data: null,
						render: function (data, type, row, meta) {
							return meta.row + meta.settings._iDisplayStart + 1;
						},
					},
					{ data: 'businessName' },
					{ data: 'email' },
					{
						data: null,
						title: 'DATE',
						render: function (data) {
							let date = '' + data.createdAt;
							return date.substring(0, 10);
						},
					},
					{ data: 'click' },
					{
						data: null,
						render: function (data) {
							return "<button class='btn register-detail' type='button'>자세히보기</button>";
						},
					},
				],
				ordering: false,
				pageLength: 5,
				lengthMenu: [
					[5, 10, 20, -1],
					[5, 10, 20, 'Todos'],
				],
				visible: false,
				searching: false,
				info: false,
				autoWidth: false,
			});
		},
		error: function (response) {
			console.log(response.responseText);
		},
	});

	$(document).on('click', '.register-detail', function () {
		location.href = '/admin/ad';
	});

	$.ajax({
		url: '/report-posts',
		type: 'Get',
		dataType: 'json',
		dataSrc: '',
		headers: { Authorization: 'Bearer ' + accessToken },
		success: function (response) {
			table = $('.posts-report').DataTable({
				data: response,
				columns: [
					{ data: 'user.nickname' },
					{
						data: null,
						render: function (data) {
							return "<button class='btn report-detail' type='button'>자세히보기</button>";
						},
					},
				],
				ordering: false,
				pageLength: 5,
				lengthMenu: [
					[5, 10, 20, -1],
					[5, 10, 20, 'Todos'],
				],
				visible: false,
				searching: false,
				info: false,
				autoWidth: false,
			});
		},
		error: function (response) {
			console.log(response.responseText);
		},
	});

	$(document).on('click', '.report-detail', function () {
		location.href = '/admin/posts/report';
	});

	$(document).ajaxSend(function (event, jqxhr, settings) {
		$.LoadingOverlay('show');
	});

	$(document).ajaxComplete(function (event, jqxhr, settings) {
		$.LoadingOverlay('hide');
	});

	$('.btn-submit').click(function () {
		alert('시간이 소요될 수 있습니다. 로딩 중 창을 닫지 마세요.');
		var form = new FormData();
		form.append('file', $('#file-upload')[0].files[0]);

		$.ajax({
			type: 'POST',
			url: '/spots',
			processData: false,
			contentType: false,
			headers: { Authorization: 'Bearer ' + accessToken },
			data: form,
			success: function () {
				alert('저장 완료!');
			},
			err: function (err) {
				alert('실패! 다시 시도해주세요.');
				console.log('err:', err);
			},
		});
	});

	$('.btn-training').click(function () {
		$.ajax({
			type: 'POST',
			url: '/recommendations',
			processData: false,
			contentType: false,
			headers: { Authorization: 'Bearer ' + accessToken },
			data: '',
			success: function () {
				alert('훈련 완료!');
			},
			err: function (err) {
				alert('실패! 다시 시도해주세요.');
				console.log('err:', err);
			},
		});
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

	$('.icon-home').click(function () {
		window.location.href = '/admin';
	});
});
