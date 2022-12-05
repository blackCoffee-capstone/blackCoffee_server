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
			alert('관리자 권한이 필요합니다.');
			window.location.href = '/admin/login';
		},
	});

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
