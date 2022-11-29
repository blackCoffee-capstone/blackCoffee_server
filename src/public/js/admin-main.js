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
			table = $('#list_table').DataTable({
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
							return "<button class='btn btn-detail' type='button'>자세히보기</button>";
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

	$(document).on('click', '.btn-detail', function () {
		location.href = '/admin/ad-request';
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
