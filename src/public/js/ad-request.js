$(document).ready(function () {
	var accessToken = localStorage.getItem('accessToken');
	$.ajax({
		url: '/users/admin-test',
		type: 'Get',
		headers: { Authorization: 'Bearer ' + accessToken },
		success: function (data) {},
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
					{ orderable: false, data: 'email' },
					{
						data: null,
						title: 'DATE',
						width: 100,
						render: function (data) {
							let date = '' + data.createdAt;
							return date.substring(0, 10);
						},
					},
					{ data: 'status' },
					{
						orderable: false,
						title: 'DETAIL',
						data: null,
						render: function (data) {
							return '<a href="#" class="detail-link">DETAIL</a>';
						},
					},
				],
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

	$('body').on('click', function (event) {
		if (event.target.className == 'close' || event.target.className == 'backon') {
			$('#popup').hide();
			$('.backon').hide();
			location.reload();
		}
	});

	$('input:radio[name=status]').click(function () {
		table.columns(4).search(this.value).draw();
	});

	$('#list_table').on('click', 'td', function () {
		$('#popup').show();
		$('.modal-body').empty();
		var row_data = table.row(this).data();
		var data_list = '';
		console.log(row_data.id); //row_data 확인
		$.ajax({
			url: '/admins/ad-forms/' + row_data.id,
			type: 'GET',
			dataType: 'json',
			dataSrc: '',
			headers: { Authorization: 'Bearer ' + accessToken },
			success: function (adform) {
				console.log(adform);
				var img_data = '<img src="' + adform.licenseUrl + '" alt="license">';
				$('.modal-body').append('<div> 회사명 : ' + adform.businessName + '</div>');
				$('.modal-body').append('<div> 위치 : ' + adform.address + '</div>');
				$('.modal-body').append('<div> 이메일 : ' + adform.email + '</div>');
				if (adform.phoneNumber != null) {
					$('.modal-body').append('<div> 전화번호 : ' + adform.phoneNumber + '</div>');
				}
				$('.modal-body').append('<div> 상태 : ' + adform.status + '</div>');
				$('.modal-body').append('<div>사업자 등록증</div>');
				$('.modal-body').append(img_data);
				$('#popup').append(data_list);
				$('body').append('<div class="backon"></div>');
			},
			error: function (response) {
				alert(response.responseText);
			},
		});
		$('.btn-approve').click(function () {
			var result = confirm("해당 광고의 상태를 'approve'로 변경하시겠습니까?");
			if (result) {
				$.ajax({
					url: '/admins/ad-forms/' + row_data.id,
					type: 'PATCH',
					dataType: 'json',
					contentType: 'application/json',
					processData: false,
					data: JSON.stringify({ status: 'Approve' }),
					headers: { Authorization: 'Bearer ' + accessToken },
					success: function (data) {
						alert('변경 완료!');
					},
					error: function (data) {
						console.log(data);
					},
				});
			}
		});

		$('.btn-reject').click(function () {
			var result = confirm("해당 광고의 상태를 'reject'로 변경하시겠습니까?");
			if (result) {
				$.ajax({
					url: '/admins/ad-forms/' + row_data.id,
					type: 'PATCH',
					dataType: 'json',
					contentType: 'application/json',
					processData: false,
					data: JSON.stringify({ status: 'Reject' }),
					headers: { Authorization: 'Bearer ' + accessToken },
					success: function (data) {
						alert('변경 완료!');
					},
					error: function (data) {
						console.log(data);
					},
				});
			}
		});

		$('.btn-todo').click(function () {
			var result = confirm("해당 광고의 상태를 'Todo'로 변경하시겠습니까?");
			if (result) {
				$.ajax({
					url: '/admins/ad-forms/' + row_data.id,
					type: 'PATCH',
					dataType: 'json',
					contentType: 'application/json',
					processData: false,
					data: JSON.stringify({ status: 'Todo' }),
					headers: { Authorization: 'Bearer ' + accessToken },
					success: function (data) {
						alert('변경 완료!');
					},
					error: function (data) {
						console.log(data);
					},
				});
			} else {
			}
		});

		$('.btn-delete').click(function () {
			var result = confirm('해당 광고를 정말로 삭제하시겠습니까?');
			if (result) {
				$.ajax({
					url: '/admins/ad-forms/' + row_data.id,
					type: 'DELETE',
					processData: false,
					data: '',
					headers: { Authorization: 'Bearer ' + accessToken },
					success: function (data) {
						alert('삭제 완료!');
					},
					error: function (data) {
						console.log(data);
					},
				});
				$('#popup').hide();
				$('.backon').hide();
				location.reload();
			} else {
			}
		});
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
});
