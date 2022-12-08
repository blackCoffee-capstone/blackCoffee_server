$(document).ready(function () {
	var accessToken = localStorage.getItem('accessToken');

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
		error: function (data) {
			alert('관리자 권한이 필요합니다.');
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

	$.ajax({
		url: '/report-posts',
		type: 'Get',
		dataType: 'json',
		dataSrc: '',
		headers: { Authorization: 'Bearer ' + accessToken },
		success: function (response) {
			table = $('#list_table').DataTable({
				data: response,
				columns: [
					{
						orderable: false,
						data: 'id',
						defaultContent: '',
						width: '20px',
						checkboxes: {
							selectRow: true,
						},
					},
					{
						width: '30px',
						data: null,
						render: function (data, type, row, meta) {
							return meta.row + meta.settings._iDisplayStart + 1;
						},
					},
					{ data: 'user.nickname', width: '100px' },
					{ orderable: false, data: 'reason' },
					{ data: 'status', width: '80px' },
					{
						width: '60px',
						orderable: false,
						data: null,
						render: function (data) {
							return '<a href="#" class="detail-link">LINK</a>';
						},
					},
					{
						width: '60px',
						orderable: false,
						data: null,
						defaultContent: "<button class='btn btn-delete'>Delete</button>",
					},
				],
				select: {
					style: 'multi',
				},
				order: [[1, 'asc']],
				ordering: true,
				lengthChange: false,
				pagingType: 'full_numbers',
				info: true,
				autoWidth: false,
			});
		},
		error: function (response) {
			console.log(response.responseText);
		},
	});

	$('input:radio[name=status]').click(function () {
		table.columns(4).search(this.value).draw();
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

	$('.btn-update').click(function () {
		location.reload();
	});

	$('.btn-todo').click(function () {
		var result = confirm('정말로 상태를 "todo"로 변경하시겠습니까?');
		var reportIds = [];
		select = table.column(0).checkboxes.selected();
		$.each(select, function (index, rowId) {
			reportIds.push(rowId);
		});

		var form = {
			reportIds: reportIds,
			status: 'Todo',
		};

		if (result) {
			$.ajax({
				url: '/report-posts',
				type: 'PATCH',
				headers: { Authorization: 'Bearer ' + accessToken },
				dataType: 'json',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: form,
				headers: { Authorization: 'Bearer ' + accessToken },
				success: function (data) {
					alert('변경 완료!');
				},
				error: function (request, status, error) {
					alert(
						'code:' + request.status + '\n' + 'message:' + request.responseText + '\n' + 'error:' + error,
					);
				},
			});
		}
	});

	$('.btn-approve').click(function () {
		var result = confirm('정말로 상태를 "approve"로 변경하시겠습니까?');
		var reportIds = [];
		select = table.column(0).checkboxes.selected();
		$.each(select, function (index, rowId) {
			reportIds.push(rowId);
		});

		var form = {
			reportIds: reportIds,
			status: 'Approve',
		};

		if (result) {
			$.ajax({
				url: '/report-posts',
				type: 'PATCH',
				headers: { Authorization: 'Bearer ' + accessToken },
				dataType: 'json',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: form,
				headers: { Authorization: 'Bearer ' + accessToken },
				success: function (data) {
					alert('변경 완료!');
				},
				error: function (request, status, error) {
					alert(
						'code:' + request.status + '\n' + 'message:' + request.responseText + '\n' + 'error:' + error,
					);
				},
			});
		}
	});

	$('.btn-reject').click(function () {
		var result = confirm('정말로 상태를 "reject"로 변경하시겠습니까?');
		var reportIds = [];
		select = table.column(0).checkboxes.selected();
		$.each(select, function (index, rowId) {
			reportIds.push(rowId);
		});

		var form = {
			reportIds: reportIds,
			status: 'Reject',
		};

		if (result) {
			$.ajax({
				url: '/report-posts',
				type: 'PATCH',
				headers: { Authorization: 'Bearer ' + accessToken },
				dataType: 'json',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: form,
				headers: { Authorization: 'Bearer ' + accessToken },
				success: function (data) {
					alert('변경 완료!');
					window.location.reload();
				},
				error: function (request, status, error) {
					alert(
						'code:' + request.status + '\n' + 'message:' + request.responseText + '\n' + 'error:' + error,
					);
				},
			});
		}
	});

	$('#list_table').on('click', '.btn-delete', function () {
		var result = confirm('정말로 삭제하시겠습니까?');
		var data = table.row($(this).parents('td')).data();
		if (result) {
			$.ajax({
				url: '/report-posts/' + data.id,
				type: 'DELETE',
				headers: { Authorization: 'Bearer ' + accessToken },
				processData: false,
				data: '',
				headers: { Authorization: 'Bearer ' + accessToken },
				success: function (data) {
					alert('삭제 완료!');
				},
				error: function (request, status, error) {
					console.log(
						'code:' + request.status + '\n' + 'message:' + request.responseText + '\n' + 'error:' + error,
					);
				},
			});
		}
	});

	$('#list_table').on('click', '.detail-link', function () {
		var data = table.row($(this).parents('td')).data();
		sessionStorage.setItem('postNumber', data.post.id);
		window.open('/admin/posts/detail');
	});
});
